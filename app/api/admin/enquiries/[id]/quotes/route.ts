import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import { serializeQuote } from "@/app/features/quotes/lib/serialize-quote";
import { createQuoteSchema } from "@/app/features/quotes/lib/quote-schema";
import { calculateQuoteTotals } from "@/app/features/quotes/lib/calculate-quote-totals";
import { generateReference } from "@/lib/utils";
import { Prisma } from "@/generated/prisma/client";
import {
  issueQuote,
  QuoteIssueError,
} from "@/app/features/quotes/server/issue-quote";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await params;

    const enquiry = await prisma.enquiry.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!enquiry) {
      return NextResponse.json(
        {
          success: false,
          message: "Enquiry not found",
        },
        { status: 404 },
      );
    }

    const quotes = await prisma.quote.findMany({
      where: {
        enquiryId: id,
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

    return NextResponse.json({
      success: true,
      data: quotes.map(serializeQuote),
    });
  } catch (error) {
    console.error("GET /api/admin/enquiries/[id]/quotes error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch enquiry quotations",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const authResult = await requireAdmin();
    const { id: enquiryId } = await params;

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

    const { items, expiresAt, taxType, responseNotes, status } = parsed.data;

    if (items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "This quotation has no items.",
        },
        { status: 400 },
      );
    }

    const enquiry = await prisma.enquiry.findUnique({
      where: {
        id: enquiryId,
      },
      select: {
        id: true,
        reference: true,
        status: true,
        courseId: true,
        courseName: true,
        deliveryMode: true,
        participantCount: true,
        course: {
          select: {
            pricing: {
              select: {
                currency: true,
                deliveryMode: true,
              },
            },
          },
        },
      },
    });

    if (!enquiry) {
      return NextResponse.json(
        {
          success: false,
          message: "Enquiry not found",
        },
        { status: 404 },
      );
    }

    if (enquiry.status === "CLOSED" || enquiry.status === "CONVERTED") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Quotations cannot be created for closed or converted enquiries.",
        },
        { status: 409 },
      );
    }

    if (!enquiry.courseId && !enquiry.courseName) {
      return NextResponse.json(
        {
          success: false,
          message: "A course must be assigned before creating a quotation.",
        },
        { status: 400 },
      );
    }

    if (!enquiry.deliveryMode) {
      return NextResponse.json(
        {
          success: false,
          message: "Select a delivery method before creating a quotation.",
        },
        { status: 400 },
      );
    }

    const pricingCurrency = enquiry.course?.pricing.find(
      (price) => price.deliveryMode === enquiry.deliveryMode,
    )?.currency ?? 'KES';

    if (!pricingCurrency) {
      return NextResponse.json(
        {
          success: false,
          message: "No pricing is configured for the selected delivery method.",
        },
        { status: 400 },
      );
    }

    const activeQuote = await prisma.quote.findFirst({
      where: {
        enquiryId,
        status: {
          in: ["DRAFT", "ISSUED", "SENT", "ACCEPTED"],
        },
      },
      select: {
        id: true,
        reference: true,
      },
    });

    if (activeQuote) {
      return NextResponse.json(
        {
          success: false,
          message:
            `Quotation ${activeQuote.reference} is still active. ` +
            "Void or resolve it before creating another.",
        },
        { status: 409 },
      );
    }

    const { calculatedItems, taxRate, subtotal, taxAmount, totalAmount } =
      calculateQuoteTotals(items, taxType);

    const quote = await prisma.$transaction(async (tx) => {
      const created = await tx.quote.create({
        data: {
          enquiryId,
          bookingId: null,

          reference: generateReference("QT"),

          status: "DRAFT",
          currency: pricingCurrency,

          taxType,
          taxRate,
          subtotal,
          taxAmount,
          totalAmount,

          expiresAt: expiresAt ? new Date(expiresAt) : null,

          responseNotes: responseNotes ?? null,

          issuedAt: null,
          pdfPath: null,
          emailStatus: "NOT_SENT",

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

      await tx.enquiry.update({
        where: {
          id: enquiryId,
        },
        data: {
          status: "IN_PROGRESS",
        },
      });

      await tx.enquiryActivity.create({
        data: {
          enquiryId,
          type: "QUOTE_CREATED",
          description:
            `Draft quotation ${created.reference} created ` +
            `for ${pricingCurrency} ${totalAmount.toFixed(2)}. Enquiry status set to IN_PROGRESS.`,
          createdBy: authResult.user.id,
          metadata: {
            quoteId: created.id,
            quoteReference: created.reference,
          },
        },
      });

      return created;
    });

    let finalQuote = quote;

    if (status === "ISSUED") {
      try {
        finalQuote = await issueQuote({
          quoteId: quote.id,
          adminUserId: authResult.user.id,
        });
      } catch (error) {
        console.error(
          `Quotation ${quote.reference} created but issuance failed:`,
          error,
        );

        const issueMessage =
          error instanceof QuoteIssueError
            ? error.message
            : "PDF generation or issuance failed.";

        // Read the actual quotation state after the failure.
        // Do not assume the issuance claim was released.
        const savedQuote = await prisma.quote.findUniqueOrThrow({
          where: {
            id: quote.id,
          },
          include: {
            items: {
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        });

        return NextResponse.json(
          {
            success: true,

            message:
              `Quotation ${quote.reference} was saved, ` +
              "but could not be issued.",

            data: {
              quote: serializeQuote(savedQuote),
              issuance: {
                requested: true,
                success: false,
                message: issueMessage,
              },
            },
          },
          { status: 201 },
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        message:
          status === "ISSUED"
            ? "Quotation created and issued successfully."
            : "Draft quotation created successfully.",

        data: {
          quote: serializeQuote(finalQuote),
          issuance: {
            requested: status === "ISSUED",
            success: status === "ISSUED",
            message: null,
          },
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/admin/enquiries/[id]/quotes error:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Quotation reference already exists.",
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
