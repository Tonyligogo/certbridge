import { updateQuoteSchema } from "@/app/features/quotes/lib/quote-schema";
import { serializeQuote } from "@/app/features/quotes/lib/serialize-quote";
import { QuoteUpdateError, updateQuote } from "@/app/features/quotes/services/update-quote";
import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    bookingId: string;
    quoteId: string;
  }>;
};

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
     const { bookingId, quoteId } = await params;

    await requireAdmin();

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      select: {
        id: true,
        reference: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found",
        },
        { status: 404 },
      );
    }

    const quote = await prisma.quote.findFirst({
  where: {
    id: quoteId,
        bookingId,
  },
  include: {
    items: {
      orderBy: {
        createdAt: "asc",
      },
    },
  },
  orderBy: {
    createdAt: "desc",
  },
});

    if (!quote) {
      return NextResponse.json(
        {
          success: true,
          message: "No quote exists for this booking",
          data: null,
        },
        { status: 200 },
      );
    }

    return NextResponse.json({
      success: true,
      data: serializeQuote(quote)
    });
  } catch (error) {
    console.error("GET quote error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch quote",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const authResult = await requireAdmin();
    const { bookingId, quoteId } = await params;

    const body = await request.json();
    const parsed = updateQuoteSchema.safeParse(body);

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

    const updated = await updateQuote({
      quoteId,
      adminUserId: authResult.user.id,
      input: parsed.data,
      source: {
        bookingId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Quotation updated successfully.",
      data: serializeQuote(updated),
    });
  } catch (error) {
    if (error instanceof QuoteUpdateError) {
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

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON request body.",
        },
        { status: 400 },
      );
    }

    console.error("PATCH booking quotation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update quotation.",
      },
      { status: 500 },
    );
  }
}