import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import { quoteStorageService } from "@/app/features/quotes/services/quote-storage-service";
import { quoteSelect } from "@/app/features/quotes/lib/quote-select";
import { sendQuoteEmail } from "@/app/features/quotes/emails/send-quote-email";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{
    bookingId: string;
    quoteId: string;
  }>;
}

const sendInvoiceSchema = z.object({
  email: z.email().optional(),
  resend: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin();

    const { bookingId, quoteId } = await params;

    // Optional request body:
    // { email: "client@example.com", resend: false }
    let body: unknown = {};

    try {
      const raw = await request.text();
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

    const parsed = sendInvoiceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email request.",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const quote = await prisma.quote.findFirst({
      where: {
        id: quoteId,
        bookingId,
      },
      include: {
        booking: {
          select: {
            reference: true,
            contactName: true,
            contactEmail: true,
            organizationName: true,
            course: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    if (!quote) {
      return NextResponse.json(
        {
          success: false,
          message: "Quote not found.",
        },
        { status: 404 },
      );
    }

    // Only finalized invoices can be sent.
    if (!["DRAFT"].includes(quote.status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only draft quotes can be emailed.",
        },
        { status: 409 },
      );
    }

    if (!quote.pdfPath) {
      return NextResponse.json(
        {
          success: false,
          message: "Quote PDF is missing. Please contact an administrator.",
        },
        { status: 409 },
      );
    }

    const recipientEmail =
      parsed.data.email?.trim() || quote.booking.contactEmail;

    if (!z.email().safeParse(recipientEmail).success) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid recipient email is required.",
        },
        { status: 400 },
      );
    }

    // Prevent accidental duplicate sends.
    if (quote.emailStatus === "SENT" && !parsed.data.resend) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This quote has already been sent.",
        },
        { status: 409 },
      );
    }

    if (quote.emailStatus === "PENDING") {
      return NextResponse.json(
        {
          success: false,
          message:
            "This quote has an email attempt in progress. Check its delivery status before retrying.",
        },
        { status: 409 },
      );
    }

    // Atomically claim the email attempt.
    // The original emailStatus prevents simultaneous sends.
    const claim = await prisma.quote.updateMany({
      where: {
        id: quoteId,
        bookingId,
        status: {
          in: ["DRAFT"],
        },
        pdfPath: {
          not: null,
        },
        emailStatus: quote.emailStatus,
      },
      data: {
        emailStatus: "PENDING",
      },
    });

    if (claim.count !== 1) {
      return NextResponse.json(
        {
          success: false,
          message: "Quote email status changed. Refresh and try again.",
        },
        { status: 409 },
      );
    }

    // From this point, failures must be tracked.
    // A PENDING status is kept if the send outcome is uncertain.
    try {
      const pdfBlob = await quoteStorageService.download(quote.pdfPath);

      const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());

      const result = await sendQuoteEmail({
        recipientEmail,

        client: {
          contactName: quote.booking.contactName,
          organizationName: quote.booking.organizationName,
        },

        quote: {
          reference: quote.reference,
          bookingReference: quote.booking.reference,
          courseTitle: quote.booking.course.title,

          currency: quote.currency,
          totalAmount: quote.totalAmount.toString(),

          issuedAt: quote.issuedAt!,
          dueAt: quote.expiresAt,
        },

        pdf: pdfBuffer,
      });

      const updated = await prisma.quote.update({
        where: {
          id: quoteId,
        },
        data: {
          emailStatus: "SENT",
          sentAt: new Date(),
          sentTo: recipientEmail,
        },
        select: quoteSelect,
      });

      return NextResponse.json({
        success: true,
        message: parsed.data.resend
          ? "Quote resent successfully."
          : "Quote email submitted successfully.",
        email: {
          id: result.id,
          to: recipientEmail,
          acceptedAt: new Date(),
          status: "SENT",
        },
        data: {
          id:updated.id
        },
      });
    } catch (error) {
      console.error("Send quote email error:", error);

      // Leave PENDING if outcome is uncertain.
      return NextResponse.json(
        {
          success: false,
          message:
            "Quote email processing failed or its outcome could not be confirmed. Check the Resend dashboard before retrying.",
        },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("Quote email endpoint error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to process quote email.",
      },
      { status: 500 },
    );
  }
}
