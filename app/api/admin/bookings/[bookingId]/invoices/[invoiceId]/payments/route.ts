import { paymentSelect } from "@/app/features/payments/lib/payment-select";
import { serializePayment } from "@/app/features/payments/lib/serialize-payment";
import { recordPaymentSchema } from "@/app/features/payments/schema/schemas";
import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import { generateReference } from "@/lib/utils";
import {
  NextRequest,
  NextResponse,
} from "next/server";

interface RouteContext {
  params: Promise<{
    bookingId: string;
    invoiceId: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    await requireAdmin();

    const {
      bookingId,
      invoiceId,
    } = await params;

    /*
     * Verify invoice belongs to booking.
     */
    const invoice =
      await prisma.invoice.findFirst({
        where: {
          id: invoiceId,
          bookingId,
        },

        select: {
          id: true,
        },
      });

    if (!invoice) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invoice not found.",
        },
        { status: 404 }
      );
    }

    const payments =
      await prisma.payment.findMany({
        where: {
          invoiceId,
        },

        select:
          paymentSelect,

        orderBy: [
          {
            paidAt: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
      });

    return NextResponse.json({
      success: true,

      data:
        payments.map(
          serializePayment
        ),
    });
  } catch (error) {
    console.error(
      "Get invoice payments error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch payments.",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const admin = await requireAdmin();

    const { bookingId, invoiceId } = await params;

    const body = await request.json();

    const parsed = recordPaymentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid payment data.",
          errors:
            parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
      amount,
      currency,
      method,
      transactionReference,
      paidAt,
      notes,
    } = parsed.data;

    const result =
      await prisma.$transaction(
        async (tx) => {
          /*
           * 1. Fetch invoice and verify that it
           * actually belongs to this booking.
           */
          const invoice =
            await tx.invoice.findFirst({
              where: {
                id: invoiceId,
                bookingId,
              },

              select: {
                id: true,
                reference: true,
                status: true,
                currency: true,
                totalAmount: true,

                payments: {
                  where: {
                    status: "COMPLETED",
                  },

                  select: {
                    amount: true,
                  },
                },
              },
            });

          if (!invoice) {
            throw new Error(
              "INVOICE_NOT_FOUND"
            );
          }

          /*
           * Payments should only be recorded
           * against an issued invoice.
           */
          if (
            invoice.status !== "ISSUED"
          ) {
            throw new Error(
              "INVOICE_NOT_PAYABLE"
            );
          }

          /*
           * The payment must use the same
           * currency as the invoice.
           */
          if (
            currency !== invoice.currency
          ) {
            throw new Error(
              "CURRENCY_MISMATCH"
            );
          }

          /*
           * 2. Convert the incoming decimal
           * string to Prisma.Decimal.
           */
          const paymentAmount = new Prisma.Decimal(amount);

          /*
           * 3. Calculate amount already paid.
           *
           * Never use Number() for this.
           */
          const alreadyPaid =
            invoice.payments.reduce(
              (total, payment) =>
                total.add(
                  payment.amount
                ),

              new Prisma.Decimal(0)
            );

          const outstandingBalance =
            invoice.totalAmount.sub(
              alreadyPaid
            );

          /*
           * The invoice should never receive
           * more money than is outstanding.
           */
          if (
            paymentAmount.gt(
              outstandingBalance
            )
          ) {
            throw new Error(
              "PAYMENT_EXCEEDS_BALANCE"
            );
          }

          /*
           * 4. Generate payment reference.
           */
          const reference = generateReference('PAY');

          /*
           * 5. Create completed payment.
           *
           * This endpoint represents manually
           * recording money that has actually
           * been received.
           */
          const payment =
            await tx.payment.create({
              data: {
                invoiceId,
                reference,
                amount: paymentAmount,
                currency,
                method,
                status: "COMPLETED",
                transactionReference: transactionReference || null,
                paidAt: paidAt ? new Date(paidAt) : new Date(),
                notes: notes || null,
              },
              select: paymentSelect,
            });

          /*
           * 6. Determine the new balance.
           */
          const newPaidAmount =
            alreadyPaid.add(
              paymentAmount
            );

          const newBalance =
            invoice.totalAmount.sub(
              newPaidAmount
            );

          const fullyPaid =
            newBalance.lte(0);

          /*
           * 7. Automatically mark invoice PAID.
           */
          if (fullyPaid) {
            await tx.invoice.update({
              where: {
                id: invoiceId,
              },

              data: {
                status: "PAID",
              },
            });
          }

          /*
           * 8. Write booking activity.
           */
          await tx.bookingActivity.create({
            data: {
              bookingId,
              type: "PAYMENT_RECEIVED",
              description:
                `Payment ${payment.reference} of ${payment.currency} ${payment.amount.toString()} received for invoice ${invoice.reference}.`,

              createdBy: admin.user.id,

              metadata: {
                paymentId: payment.id,
                paymentReference: payment.reference,
                invoiceId: invoice.id,
                invoiceReference: invoice.reference,
                amount: payment.amount.toString(),
                currency: payment.currency,
                paidAmount: newPaidAmount.toString(),
                balance: newBalance.toString(),
                fullyPaid,
              },
            },
          });

          return {
            payment,
            paidAmount: newPaidAmount,
            balance: newBalance,
            fullyPaid,
          };
        }
      );

    return NextResponse.json(
      {
        success: true,

        message:
          result.fullyPaid
            ? "Payment recorded. Invoice is now fully paid."
            : "Payment recorded successfully.",

        data: {
          payment: serializePayment(result.payment),
          paidAmount: result.paidAmount.toString(),
          balance: result.balance.toString(),
          fullyPaid: result.fullyPaid,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "INVOICE_NOT_FOUND"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invoice not found.",
        },
        { status: 404 }
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "INVOICE_NOT_PAYABLE"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Payments can only be recorded against an issued invoice.",
        },
        { status: 409 }
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "CURRENCY_MISMATCH"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Payment currency must match the invoice currency.",
        },
        { status: 400 }
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "PAYMENT_EXCEEDS_BALANCE"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Payment amount cannot exceed the outstanding invoice balance.",
        },
        { status: 400 }
      );
    }

    console.error(
      "Record payment error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to record payment.",
      },
      { status: 500 }
    );
  }
}