import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Prisma } from "@/generated/prisma/client";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import { updateQuoteStatusSchema } from "@/app/features/quotes/lib/quote-schema";
import { QuoteStatusError, updateQuoteStatus } from "@/app/features/quotes/services/update-quote-status";

type RouteContext = {
  params: Promise<{
    bookingId: string;
    quoteId: string;
  }>;
};

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const authResult = await requireAdmin();
    const { bookingId, quoteId } = await params;

    const body = await request.json();
    const parsed = updateQuoteStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: parsed.error,
        },
        { status: 400 },
      );
    }

    const quote = await prisma.quote.findFirst({
      where: {
        id: quoteId,
        bookingId,
      },
      select: {
        id: true,
      },
    });

    if (!quote) {
      return NextResponse.json(
        {
          success: false,
          message: "Quotation not found for this booking.",
        },
        { status: 404 },
      );
    }

    const updated = await updateQuoteStatus({
      quoteId,
      adminUserId: authResult.user.id,
      status: parsed.data.status,
      responseNotes: parsed.data.responseNotes,
    });

    return NextResponse.json({
      success: true,
      message:
        updated.status === "ACCEPTED"
          ? "Quotation accepted and booking confirmed."
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
      ["P2034", "P2002"].includes(error.code)
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

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON request body.",
        },
        { status: 400 },
      );
    }

    console.error("PATCH booking quotation status error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update quotation status.",
      },
      { status: 500 },
    );
  }
}
