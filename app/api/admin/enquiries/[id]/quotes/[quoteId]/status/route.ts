
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import { updateQuoteStatusSchema } from "@/app/features/quotes/lib/quote-schema";
import { QuoteStatusError, updateQuoteStatus } from "@/app/features/quotes/services/update-quote-status";
import { handleAuthError } from "@/app/features/trainers/lib/authError";

type RouteContext = {
  params: Promise<{
    id: string;
    quoteId: string;
  }>;
};

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const session = await requireAdmin();

    const { id: enquiryId, quoteId } = await params;

    const body = await request.json().catch(() => null);

    const parsed = updateQuoteStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: parsed.error,
        },
        { status: 400 },
      );
    }

    // Verify that this quotation belongs to the enquiry.
    const existing = await prisma.quote.findFirst({
      where: {
        id: quoteId,
        enquiryId,
      },
      select: {
        id: true,
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Quotation not found for this enquiry.",
        },
        { status: 404 },
      );
    }

    const updated = await updateQuoteStatus({
      quoteId,
      adminUserId: session.user.id,
      status: parsed.data.status,
      responseNotes: parsed.data.responseNotes,
    });

    return NextResponse.json({
      success: true,
      message:
        parsed.data.status === "ACCEPTED"
          ? "Quotation accepted successfully."
          : "Quotation declined successfully.",
      data: updated,
    });
  } catch (error) {
    if (error instanceof QuoteStatusError) {
  return NextResponse.json(
    {
      success: false,
      message: error.message,
    },
    { status: error.statusCode },
  );
}
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2034"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Quotation was modified by another request. Refresh and try again.",
        },
        { status: 409 },
      );
    }

    console.error(
      "PATCH enquiry quotation status error:",
      error,
    );

    const authResponse = handleAuthError(error);
    if (authResponse) return authResponse;

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update quotation status.",
      },
      { status: 500 },
    );
  }
}
