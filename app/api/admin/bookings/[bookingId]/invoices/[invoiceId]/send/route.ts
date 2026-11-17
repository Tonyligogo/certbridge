import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";

import { invoiceSelect } from "@/app/features/invoices/lib/invoice-select";
import { serializeInvoice } from "@/app/features/invoices/lib/invoice-serializer";
import { sendInvoiceEmail } from "@/app/features/invoices/emails/send-invoice-email";
import { invoiceStorageService } from "@/app/features/invoices/services/invoice-storage-service";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{
    bookingId: string;
    invoiceId: string;
  }>;
}

const sendInvoiceSchema = z.object({
  email: z.email().optional(),
  resend: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin();

    const { bookingId, invoiceId } = await params;

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

    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
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

    if (!invoice) {
      return NextResponse.json(
        {
          success: false,
          message: "Invoice not found.",
        },
        { status: 404 },
      );
    }

    // Only finalized invoices can be sent.
    if (!["ISSUED", "PAID"].includes(invoice.status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only issued or paid invoices can be emailed.",
        },
        { status: 409 },
      );
    }

    if (!invoice.pdfPath) {
      return NextResponse.json(
        {
          success: false,
          message: "Invoice PDF is missing. Please contact an administrator.",
        },
        { status: 409 },
      );
    }

    const recipientEmail =
      parsed.data.email?.trim() || invoice.booking.contactEmail;

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
    if (invoice.emailStatus === "SENT" && !parsed.data.resend) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This invoice has already been sent.",
        },
        { status: 409 },
      );
    }

    if (invoice.emailStatus === "PENDING") {
      return NextResponse.json(
        {
          success: false,
          message:
            "This invoice has an email attempt in progress. Check its delivery status before retrying.",
        },
        { status: 409 },
      );
    }

    // Atomically claim the email attempt.
    // The original emailStatus prevents simultaneous sends.
    const claim = await prisma.invoice.updateMany({
      where: {
        id: invoiceId,
        bookingId,
        status: {
          in: ["ISSUED", "PAID"],
        },
        pdfPath: {
          not: null,
        },
        emailStatus: invoice.emailStatus,
      },
      data: {
        emailStatus: "PENDING",
      },
    });

    if (claim.count !== 1) {
      return NextResponse.json(
        {
          success: false,
          message: "Invoice email status changed. Refresh and try again.",
        },
        { status: 409 },
      );
    }

    // From this point, failures must be tracked.
    // A PENDING status is kept if the send outcome is uncertain.
    try {
      const pdfBlob = await invoiceStorageService.download(invoice.pdfPath);

      const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());

      const result = await sendInvoiceEmail({
        recipientEmail,

        client: {
          contactName: invoice.booking.contactName,
          organizationName: invoice.booking.organizationName,
        },

        invoice: {
          reference: invoice.reference,
          bookingReference: invoice.booking.reference,
          courseTitle: invoice.booking.course.title,

          currency: invoice.currency,
          totalAmount: invoice.totalAmount.toString(),

          issuedAt: invoice.issuedAt!,
          dueAt: invoice.dueAt,
        },

        pdf: pdfBuffer,
      });

      const updated = await prisma.invoice.update({
        where: {
          id: invoiceId,
        },
        data: {
          emailStatus: "SENT",
          sentAt: new Date(),
          sentTo: recipientEmail,
        },
        select: invoiceSelect,
      });

      return NextResponse.json({
        success: true,
        message: parsed.data.resend
          ? "Invoice resent successfully."
          : "Invoice email submitted successfully.",
        email: {
          id: result.id,
          to: recipientEmail,
          acceptedAt: new Date(),
          status: "SENT",
        },
        data: serializeInvoice(updated),
      });
    } catch (error) {
      console.error("Send invoice email error:", error);

      // Leave PENDING if outcome is uncertain.
      return NextResponse.json(
        {
          success: false,
          message:
            "Invoice email processing failed or its outcome could not be confirmed. Check the Resend dashboard before retrying.",
        },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("Invoice email endpoint error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to process invoice email.",
      },
      { status: 500 },
    );
  }
}
