import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import {
  createQuoteSchema,
} from "@/app/features/quotes/lib/quote-schema";
import { issueQuote } from "@/app/features/quotes/server/issue-quote";
import { serializeQuote } from "@/app/features/quotes/lib/serialize-quote";
import { calculateQuoteTotals } from "@/app/features/quotes/lib/calculate-quote-totals";
import { generateReference } from "@/lib/utils";

type RouteContext = {
  params: Promise<{
    bookingId: string;
  }>;
};

//  Get the quotes for a booking.
export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { bookingId } = await params;

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

    const quotes = await prisma.quote.findMany({
  where: {
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

    if (quotes.length === 0) {
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
      data: quotes.map(serializeQuote)
    });
  } catch (error) {
    console.error("GET quotes error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch quotes",
      },
      { status: 500 },
    );
  }
}

// Create a quote belonging to a booking.
export async function POST(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const authResult = await requireAdmin();
    const { bookingId } = await params;

    const body = await request.json();
    const parsed = createQuoteSchema.safeParse(body);

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

    const {
      items,
      expiresAt,
      taxType,
      status,
      responseNotes,
    } = parsed.data;

    // -----------------------------------------
    // 1. Verify booking
    // -----------------------------------------

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      select: {
        id: true,
        reference: true,
        currency: true,
        status: true,
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

    if (["CANCELLED", "COMPLETED"].includes(booking.status)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cannot create a quotation for a cancelled or completed booking.",
        },
        { status: 409 },
      );
    }

    // -----------------------------------------
    // 2. Check for existing active quotation
    // -----------------------------------------

    const existingQuote = await prisma.quote.findFirst({
      where: {
        bookingId,
        status: {
          in: ["DRAFT", "ISSUED", "SENT", "ACCEPTED"],
        },
      },
      select: {
        id: true,
        reference: true,
        status: true,
      },
    });

    if (existingQuote) {
      return NextResponse.json(
        {
          success: false,
          message:
            `Quotation ${existingQuote.reference} ` +
            `(${existingQuote.status}) already exists. ` +
            "Void or resolve the current quotation before creating another.",
        },
        { status: 409 },
      );
    }

    // -----------------------------------------
    // 3. Validate and calculate totals
    // -----------------------------------------

    if (items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "This quotation has no items.",
        },
        { status: 400 },
      );
    }

    const {
      calculatedItems,
      taxRate,
      subtotal,
      taxAmount,
      totalAmount,
    } = calculateQuoteTotals(items, taxType);

    // Each quotation gets its own reference.
    const reference = generateReference("QT");

    // -----------------------------------------
    // 4. Create quotation and activity
    // -----------------------------------------

    const createdQuote = await prisma.$transaction(
      async (tx) => {
        const quote = await tx.quote.create({
          data: {
            bookingId,
            reference,
            status: "DRAFT",
            currency: booking.currency,

            issuedAt: null,
            pdfPath: null,
            emailStatus: "NOT_SENT",

            expiresAt: expiresAt
              ? new Date(expiresAt)
              : null,

            responseNotes: responseNotes ?? null,

            taxType,
            taxRate,
            subtotal,
            taxAmount,
            totalAmount,

            items: {
              create: calculatedItems,
            },
          },
          include: {
            items: {
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        });

        await tx.bookingActivity.create({
          data: {
            bookingId,
            type: "QUOTE_CREATED",
            description:
              `Quotation ${quote.reference} created for ` +
              `${quote.currency} ${totalAmount.toFixed(2)}.`,
            createdBy: authResult.user.id,
            metadata: {
              quoteId: quote.id,
              quoteReference: quote.reference,
              totalAmount: totalAmount.toString(),
              currency: quote.currency,
            },
          },
        });

        return quote;
      },
    );

    // -----------------------------------------
    // 5. Return draft
    // -----------------------------------------

    if (status === "DRAFT") {
      return NextResponse.json(
        {
          success: true,
          message: "Draft quotation created successfully.",
          data: serializeQuote(createdQuote),
        },
        { status: 201 },
      );
    }

    // -----------------------------------------
    // 6. Issue immediately if requested
    // -----------------------------------------

    try {
      const issued = await issueQuote({
        quoteId: createdQuote.id,
        adminUserId: authResult.user.id,
      });

      return NextResponse.json(
        {
          success: true,
          message: "Quotation created and issued successfully.",
          data: serializeQuote(issued),
        },
        { status: 201 },
      );
    } catch (error) {
      console.error(
        "Quotation created but issuance failed:",
        error,
      );

      return NextResponse.json(
        {
          success: false,
          partialSuccess: true,
          message:
            "Quotation was created as a draft, but issuance failed. " +
            "You can retry issuance from the quotation details.",
          data: serializeQuote(createdQuote),
        },
        { status: 201 },
      );
    }
  } catch (error) {
    console.error(
      "POST booking quotation error:",
      error,
    );

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A quotation conflict occurred. Refresh and try again.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create quotation.",
      },
      { status: 500 },
    );
  }
}