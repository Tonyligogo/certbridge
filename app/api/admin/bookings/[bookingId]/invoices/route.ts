import { invoiceSelect } from "@/app/features/invoices/lib/invoice-select";
import { serializeInvoice } from "@/app/features/invoices/lib/invoice-serializer";
import { createInvoiceSchema } from "@/app/features/invoices/schema/schemas";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    bookingId: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    await requireAdmin();

    const { bookingId } = await params;

    const booking =
      await prisma.booking.findUnique({
        where: {
          id: bookingId,
        },
        select: {
          id: true,
        },
      });

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    const invoices =
      await prisma.invoice.findMany({
        where: {
          bookingId,
        },

        select: invoiceSelect,

        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json({
      success: true,
      data: invoices.map(serializeInvoice),
    });
  } catch (error) {
    console.error(
      "Get invoices error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch invoices.",
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

    const { bookingId } = await params;

    const body = await request.json();

    const parsed = createInvoiceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid invoice data.",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const booking =
      await prisma.booking.findUnique({
        where: {
          id: bookingId,
        },
        select: {
          id: true,
          status: true,
          reference:true,

          quote: {
            select: {
              id: true,
              status: true,
              currency:true,
              taxRate:true,
              taxType:true,
              taxAmount:true,
              subtotal:true,
              totalAmount:true,
              items:true
            },
          },
        },
      });

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    if (booking.status === "CANCELLED") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invoices cannot be created for a cancelled booking.",
        },
        { status: 409 }
      );
    }

    if (
      !booking.quote ||
      booking.quote.status !== "ACCEPTED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "An invoice can only be created after the quotation has been accepted.",
        },
        { status: 409 }
      );
    }

    const {
      quoteId,
      dueAt,
      notes,
    } = parsed.data;

    const quote = booking.quote;

    /*
     * Don't allow the client to attach an arbitrary
     * quote to this invoice.
     */
    if (
      quoteId &&
      quoteId !== quote.id
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The selected quotation does not belong to this booking.",
        },
        { status: 400 }
      );
    }

    const invoice =
      await prisma.$transaction(
        async (tx) => {
          const reference = `INV-${booking.reference}`;

          const created =
            await tx.invoice.create({
              data: {
                bookingId,

                quoteId: quoteId ?? quote.id,

                reference,
                taxRate:quote.taxRate,
                taxType: quote.taxType,

                currency: quote.currency,

                subtotal: quote.subtotal,

                taxAmount: quote.taxAmount,

                totalAmount: quote.totalAmount,

                dueAt: dueAt ? new Date(dueAt) : null,

                notes: notes || null,

                items: {
                  create:
                    quote.items.map(
                      (item) => ({
                        name: item.name,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        amount: item.amount,
                      })
                    ),
                },
              },

              select: invoiceSelect,
            });

          await tx.bookingActivity.create({
            data: {
              bookingId,
              type: "INVOICE_CREATED",

              description:
                `Invoice ${created.reference} created.`,

              createdBy: admin.user.id,

              metadata: {
                invoiceId: created.id,

                invoiceReference: created.reference,

                totalAmount: created.totalAmount.toString(),

                currency: created.currency,
              },
            },
          });

          return created;
        }
      );

    return NextResponse.json(
      {
        success: true,
        data: serializeInvoice(invoice),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Create invoice error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create invoice.",
      },
      { status: 500 }
    );
  }
}