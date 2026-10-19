import { invoiceSelect } from "@/app/features/invoices/lib/invoice-select";
import { serializeInvoice } from "@/app/features/invoices/lib/invoice-serializer";
import { createInvoiceSchema } from "@/app/features/invoices/schema/schemas";
import { InvoiceIssueError, issueInvoice } from "@/app/features/invoices/server/issue-invoice";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    bookingId: string;
  }>;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin();

    const { bookingId } = await params;

    const booking = await prisma.booking.findUnique({
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
        { status: 404 },
      );
    }

    const invoices = await prisma.invoice.findMany({
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
    console.error("Get invoices error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch invoices.",
      },
      { status: 500 },
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

    const { quoteId, dueAt, notes, status } = parsed.data;

    // Only draft or issued can be selected during creation.
    if (status !== "DRAFT" && status !== "ISSUED") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid initial invoice status.",
        },
        { status: 400 }
      );
    }

    if (status === "ISSUED" && !dueAt) {
      return NextResponse.json(
        {
          success: false,
          message: "A due date is required to issue an invoice.",
        },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      select: {
        id: true,
        status: true,
        reference: true,
        quote: {
          select: {
            id: true,
            status: true,
            currency: true,
            taxRate: true,
            taxType: true,
            taxAmount: true,
            subtotal: true,
            totalAmount: true,
            items: true,
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

    const quote = booking.quote;

    if (!quote || quote.status !== "ACCEPTED") {
      return NextResponse.json(
        {
          success: false,
          message:
            "An invoice can only be created after the quotation has been accepted.",
        },
        { status: 409 }
      );
    }

    if (quoteId && quoteId !== quote.id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The selected quotation does not belong to this booking.",
        },
        { status: 400 }
      );
    }

    if (quote.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "The accepted quotation has no items.",
        },
        { status: 400 }
      );
    }

    // Create the invoice as a draft.
    const created = await prisma.$transaction(async (tx) => {
      const reference = `INV-${booking.reference}`;

      const invoice = await tx.invoice.create({
        data: {
          bookingId,
          quoteId: quote.id,
          reference,

          status: "DRAFT",

          taxRate: quote.taxRate,
          taxType: quote.taxType,
          currency: quote.currency,

          subtotal: quote.subtotal,
          taxAmount: quote.taxAmount,
          totalAmount: quote.totalAmount,

          issuedAt: null,
          pdfPath: null,

          emailStatus: "NOT_SENT",

          dueAt: dueAt ? new Date(dueAt) : null,
          notes: notes || null,

          items: {
            create: quote.items.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              amount: item.amount,
            })),
          },
        },
        select: invoiceSelect,
      });

      await tx.bookingActivity.create({
        data: {
          bookingId,
          type: "INVOICE_CREATED",
          description: `Invoice ${invoice.reference} created.`,
          createdBy: admin.user.id,
          metadata: {
            invoiceId: invoice.id,
            invoiceReference: invoice.reference,
            totalAmount: invoice.totalAmount.toString(),
            currency: invoice.currency,
          },
        },
      });

      return invoice;
    });

    // Admin chose to save as draft.
    if (status === "DRAFT") {
      return NextResponse.json(
        {
          success: true,
          message: "Draft invoice created successfully.",
          data: serializeInvoice(created),
        },
        { status: 201 }
      );
    }

    // Admin chose to issue immediately.
    // Use the same service as the dedicated issue route.
    try {
      const issued = await issueInvoice({
        bookingId,
        invoiceId: created.id,
        adminUserId: admin.user.id,
      });

      return NextResponse.json(
        {
          success: true,
          message: "Invoice created and issued successfully.",
          data: serializeInvoice(issued),
        },
        { status: 201 }
      );
    } catch (error) {
      console.error(
        "Invoice created but issuance failed:",
        error
      );

      // The invoice still exists as a draft.
      // Return its ID so the frontend can recover.
      return NextResponse.json(
        {
          success: false,
          partialSuccess: true,
          message:
            "Invoice was created as a draft, but could not be issued. You can retry issuance from the invoice details.",
          data: serializeInvoice(created),
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Create invoice error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create invoice.",
      },
      {
        status: error instanceof InvoiceIssueError
          ? error.statusCode
          : 500,
      }
    );
  }
}

