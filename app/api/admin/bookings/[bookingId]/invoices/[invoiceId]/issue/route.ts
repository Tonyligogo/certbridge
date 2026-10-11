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

    const { bookingId, invoiceId } = await params;

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
            },
          });

        if (!existing) {
          throw new Error("INVOICE_NOT_FOUND");
        }

        if (existing.status !== "DRAFT") {
          throw new Error(
            "INVOICE_NOT_DRAFT"
          );
        }

        const updated =
          await tx.invoice.update({
            where: {
              id: invoiceId,
            },
            data: {
              status: "ISSUED",
              issuedAt: new Date(),
            },
            select: invoiceSelect,
          });

        await tx.bookingActivity.create({
          data: {
            bookingId,
            type: "INVOICE_ISSUED",
            description: `Invoice ${updated.reference} issued.`,
            createdBy: admin.user.id,
            metadata: {
              invoiceId: updated.id,
              invoiceReference: updated.reference,
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
      message: "Invoice issued successfully.",
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
      error.message === "INVOICE_NOT_DRAFT"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only draft invoices can be issued.",
        },
        { status: 409 }
      );
    }

    console.error(
      "Issue invoice error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to issue invoice.",
      },
      { status: 500 }
    );
  }
}