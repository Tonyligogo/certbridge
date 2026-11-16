
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";

import { voidQuoteSchema } from "@/app/features/quotes/lib/quote-schema";

import {
  voidQuote,
  QuoteVoidError,
} from "@/app/features/quotes/services/void-quote";

type RouteContext = {
  params: Promise<{
    bookingId: string;
    quoteId: string;
  }>;
};

export async function POST(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const authResult = await requireAdmin();
    const { bookingId, quoteId } = await params;

    const body = await request.json();
    const parsed = voidQuoteSchema.safeParse(body);

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

    const existing = await prisma.quote.findFirst({
      where: {
        id: quoteId,
        bookingId,
      },
      select: {
        id: true,
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Quotation not found for this booking.",
        },
        { status: 404 },
      );
    }

    const voided = await voidQuote({
      quoteId,
      adminUserId: authResult.user.id,
      reason: parsed.data.reason,
    });

    return NextResponse.json({
      success: true,
      message: "Quotation voided successfully.",
      data: voided,
    });
  } catch (error) {
    if (error instanceof QuoteVoidError) {
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

    console.error("POST booking quotation void error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to void quotation.",
      },
      { status: 500 },
    );
  }
}
