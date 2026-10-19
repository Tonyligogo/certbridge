import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/course";
import { serializeInvoice } from "@/app/features/invoices/lib/invoice-serializer";
import { InvoiceIssueError, issueInvoice } from "@/app/features/invoices/server/issue-invoice";

export const runtime = "nodejs";

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

    const invoice = await issueInvoice({
      bookingId,
      invoiceId,
      adminUserId: admin.user.id,
    });

    return NextResponse.json({
      success: true,
      message: "Invoice issued successfully.",
      data: serializeInvoice(invoice),
    });
  } catch (error) {
    console.error("Issue invoice error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof InvoiceIssueError
            ? error.message
            : "Failed to issue invoice.",
      },
      {
        status:
          error instanceof InvoiceIssueError
            ? error.statusCode
            : 500,
      }
    );
  }
}

