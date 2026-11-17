import { updateQuoteSchema } from "@/app/features/quotes/lib/quote-schema";
import { serializeQuote } from "@/app/features/quotes/lib/serialize-quote";
import { issueQuote, QuoteIssueError } from "@/app/features/quotes/server/issue-quote";
import { QuoteUpdateError, updateQuote } from "@/app/features/quotes/services/update-quote";
import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    id: string;
    quoteId: string;
  }>;
}

// route for issuing a quote that has already been created and saved as a draft.
export async function POST(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const authResult = await requireAdmin();
    const { id: enquiryId, quoteId:paramsQuoteId } = await params;

    const body = await request.json();
    const quoteId = body?.quoteId as string;

    if(!quoteId){
      return NextResponse.json(
        {
          success: false,
          message: "Missing quoteId in request body.",
        },
        { status: 400 },
      );
    }

    if (paramsQuoteId !== quoteId) {
      return NextResponse.json(
        {
          success: false,
          message: "Mismatch in quoteId.",
        },
        { status: 409 },
      );
    }

    const quote = await prisma.quote.findFirst({
      where: {
        id: quoteId,
        enquiryId,
      },
      select: {
        id: true,
      },
    });

    if (!quote) {
      return NextResponse.json(
        {
          success: false,
          message: "Quotation not found for this enquiry.",
        },
        { status: 404 },
      );
    }

    try {
        await issueQuote({
          quoteId: quote.id,
          adminUserId: authResult.user.id,
        });
      } catch (error) {
        console.error(
          `Failed to issue quotation`,
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
            message:"Quotation could not be issued.",
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

    return NextResponse.json({
      success: true,
      message: "Quotation updated successfully.",
      data: quote,
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

    console.error("POST enquiry quotation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to issue quotation.",
      },
      { status: 500 },
    );
  }
}

// route for editing a draft quote and then issuing it in one request.
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const authResult = await requireAdmin();
    const { id: enquiryId, quoteId } = await params;

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

    const quote = await prisma.quote.findFirst({
      where: {
        id: quoteId,
        enquiryId,
      },
      select: {
        id: true,
      },
    });

    if (!quote) {
      return NextResponse.json(
        {
          success: false,
          message: "Quotation not found for this enquiry.",
        },
        { status: 404 },
      );
    }

    const updatedQuote = await updateQuote({
      quoteId,
      adminUserId: authResult.user.id,
      input: parsed.data,
      source: {
        enquiryId,
      },
    });

    let finalQuote = updatedQuote;

    try {
        finalQuote = await issueQuote({
          quoteId: quote.id,
          adminUserId: authResult.user.id,
        });
      } catch (error) {
        console.error(
          `Quotation ${updatedQuote.reference} updated but issuance failed:`,
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
              `Quotation ${updatedQuote.reference} was saved, ` +
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

    return NextResponse.json({
      success: true,
      message: "Quotation updated successfully.",
      data: serializeQuote(finalQuote),
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

    console.error("PATCH enquiry quotation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update quotation.",
      },
      { status: 500 },
    );
  }
}