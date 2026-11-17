import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/server/course";
import { getEnquiryQuotePdfAccess, QuotePdfAccessError } from "@/app/features/enquiry/services/enquiry-quote-pdf-access";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; quoteId: string }> },
) {
  try {
    await requireAdmin();
    const { id, quoteId } = await params;
    if (!id || !quoteId)
      return NextResponse.json(
        { success: false, error: "Invalid quotation identifier" },
        { status: 400 },
      );
    const download = request.nextUrl.searchParams.get("download") === "true";
    const data = await getEnquiryQuotePdfAccess({
      enquiryId: id,
      quoteId,
      download,
    });
    return NextResponse.json(
      { success: true, data },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof QuotePdfAccessError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status },
      );
    }
    console.error("Quotation PDF access failed", error);
    return NextResponse.json(
      { success: false, error: "Unable to access quotation PDF" },
      { status: 500 },
    );
  }
}
