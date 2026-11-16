
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";

import {
  sendQuote,
  QuoteSendError,
} from "@/app/features/quotes/services/send-quote";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{
    id: string;
    quoteId: string;
  }>;
}

const sendQuoteSchema = z.object({
  email: z.email().optional(),
  resend: z.boolean().optional().default(false),
});

export async function POST(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const authResult = await requireAdmin();
    const { id: enquiryId, quoteId } = await params;

    const raw = await request.text();
    let body: unknown = {};

    try {
      body = raw ? JSON.parse(raw) : {};
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON request body.",
        },
        { status: 400 },
      );
    }

    const parsed = sendQuoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email request.",
          errors: parsed.error.flatten().fieldErrors,
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

    const result = await sendQuote({
      quoteId,
      adminUserId: authResult.user.id,
      email: parsed.data.email,
      resend: parsed.data.resend,
    });

    return NextResponse.json({
      success: true,
      message: parsed.data.resend
        ? "Quotation resent successfully."
        : "Quotation email submitted successfully.",
      data: {
        id: result.quote.id,
      },
      email: result.email,
    });
  } catch (error) {
    if (error instanceof QuoteSendError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: error.statusCode },
      );
    }

    console.error(
      "POST enquiry quote email error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to send quotation email.",
      },
      { status: 500 },
    );
  }
}
