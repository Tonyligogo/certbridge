import { invoiceSelect } from "@/app/features/invoices/lib/invoice-select";
import { serializeInvoice } from "@/app/features/invoices/lib/invoice-serializer";
import { updateInvoiceSchema } from "@/app/features/invoices/schema/schemas";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import { NextRequest, NextResponse } from "next/server";

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

    const { bookingId, invoiceId } = await params;

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

    const invoice =
  await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      bookingId,
    },
    select: invoiceSelect,
  });

    if (!invoice) {
  return NextResponse.json(
    {
      success: false,
      message: "Invoice not found.",
    },
    { status: 404 }
  );
}

return NextResponse.json({
  success: true,
  data: serializeInvoice(invoice),
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

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const admin = await requireAdmin();

    const { bookingId, invoiceId } = await params;

    const body = await request.json();

    const parsed = updateInvoiceSchema.safeParse(body);

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

    const existing = await prisma.invoice.findFirst({
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
      return NextResponse.json(
        {
          success: false,
          message: "Invoice not found.",
        },
        { status: 404 }
      );
    }

    if (existing.status !== "DRAFT") {
      return NextResponse.json(
        {
          success: false,
          message: "Only draft invoices can be edited.",
        },
        { status: 409 }
      );
    }

    const { dueAt, notes } = parsed.data;

    const invoice = await prisma.$transaction(async (tx) => {
      const updated = await tx.invoice.update({
        where: {
          id: invoiceId,
          bookingId,
          status: "DRAFT",
        },
        data: {
          ...(dueAt !== undefined && {
            dueAt: dueAt ? new Date(dueAt) : null,
          }),
          ...(notes !== undefined && {
            notes: notes?.trim() || null,
          }),
        },
        select: invoiceSelect,
      });

      await tx.bookingActivity.create({
        data: {
          bookingId,
          type: "INVOICE_UPDATED",
          description: `Invoice ${updated.reference} updated.`,
          createdBy: admin.user.id,
          metadata: {
            invoiceId: updated.id,
            invoiceReference: updated.reference,
          },
        },
      });

      return updated;
    });

    return NextResponse.json({
      success: true,
      data: serializeInvoice(invoice),
    });
  } catch (error) {
    console.error("Update invoice error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update invoice.",
      },
      { status: 500 }
    );
  }
}
