import { invoiceSelect } from "@/app/features/invoices/lib/invoice-select";
import { serializeInvoice } from "@/app/features/invoices/lib/invoice-serializer";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    bookingId: string;
    invoiceId: string;
  }>;
}

export async function POST(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const admin = await requireAdmin();

    const { bookingId, invoiceId } =
      await params;

    const invoice = await prisma.$transaction(
      async (tx) => {
        const existing =
          await tx.invoice.findFirst({
            where: {
              id: invoiceId,
              bookingId,
            },
            select: {
              id: true,
              status: true,

              payments: {
                where: {
                  status: "COMPLETED",
                },
                select: {
                  id: true,
                },
              },
            },
          });

        if (!existing) {
          throw new Error(
            "INVOICE_NOT_FOUND"
          );
        }

        if (
          existing.status !== "DRAFT" &&
          existing.status !== "ISSUED"
        ) {
          throw new Error(
            "INVOICE_CANNOT_BE_VOIDED"
          );
        }

        if (
          existing.payments.length > 0
        ) {
          throw new Error(
            "INVOICE_HAS_PAYMENTS"
          );
        }

        const updated =
          await tx.invoice.update({
            where: {
              id: invoiceId,
            },
            data: {
              status: "VOID",
            },
            select: invoiceSelect,
          });

        await tx.bookingActivity.create({
          data: {
            bookingId,
            type: "INVOICE_VOIDED",
            description: `Invoice ${updated.reference} voided.`,
            createdBy: admin.user.id,
            metadata: {
              invoiceId: updated.id,
              invoiceReference: updated.reference,
              previousStatus: existing.status,
              totalAmount: updated.totalAmount.toString(),
              currency: updated.currency,
            },
          },
        });

        return updated;
      }
    );

    return NextResponse.json({
      success: true,
      message: "Invoice voided successfully.",
      data: serializeInvoice(invoice),
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INVOICE_NOT_FOUND"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invoice not found.",
        },
        { status: 404 }
      );
    }

    if (
      error instanceof Error &&
      error.message === "INVOICE_CANNOT_BE_VOIDED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Only draft or issued invoices can be voided.",
        },
        { status: 409 }
      );
    }

    if (
      error instanceof Error &&
      error.message === "INVOICE_HAS_PAYMENTS"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "An invoice with completed payments cannot be voided.",
        },
        { status: 409 }
      );
    }

    console.error("Void invoice error:",error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to void invoice.",
      },
      { status: 500 }
    );
  }
}