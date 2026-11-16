
import "server-only";

import { z } from "zod";

import prisma from "@/lib/prisma";
import { quoteStorageService } from "./quote-storage-service";
import { sendQuoteEmail } from "../emails/send-quote-email";

export class QuoteSendError extends Error {
  constructor(
    message: string,
    public statusCode = 400,
  ) {
    super(message);
    this.name = "QuoteSendError";
  }
}

interface SendQuoteOptions {
  quoteId: string;
  adminUserId: string;
  email?: string;
  resend?: boolean;
}

export async function sendQuote({
  quoteId,
  adminUserId,
  email,
  resend = false,
}: SendQuoteOptions) {
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: {
      booking: {
        select: {
          reference: true,
          contactName: true,
          contactEmail: true,
          organizationName: true,
          course: {
            select: { title: true },
          },
        },
      },
      enquiry: {
        select: {
          reference: true,
          fullName: true,
          email: true,
          organization: true,
          courseName: true,
          course: {
            select: { title: true },
          },
        },
      },
    },
  });

  if (!quote) {
    throw new QuoteSendError(
      "Quotation not found.",
      404,
    );
  }

  if (!quote.booking && !quote.enquiry) {
    throw new QuoteSendError(
      "Quotation has no associated booking or enquiry.",
      409,
    );
  }

  if (!["ISSUED", "SENT"].includes(quote.status)) {
  throw new QuoteSendError(
    "Only issued or previously sent quotations can be emailed.",
    409,
  );
}

  if (!quote.pdfPath || !quote.issuedAt) {
    throw new QuoteSendError(
      "Quotation must have an issued PDF before it can be sent.",
      409,
    );
  }

  const client = quote.booking
    ? {
        contactName: quote.booking.contactName,
        contactEmail: quote.booking.contactEmail,
        organizationName: quote.booking.organizationName,
        reference: quote.booking.reference,
        courseTitle: quote.booking.course.title,
      }
    : {
        contactName: quote.enquiry!.fullName,
        contactEmail: quote.enquiry!.email,
        organizationName: quote.enquiry!.organization,
        reference: quote.enquiry!.reference,
        courseTitle:
          quote.enquiry!.course?.title ??
          quote.enquiry!.courseName ??
          "Training Programme",
      };

  const recipientEmail =
    email?.trim() || client.contactEmail;

  if (!z.email().safeParse(recipientEmail).success) {
    throw new QuoteSendError(
      "A valid recipient email is required.",
      400,
    );
  }

  if (quote.emailStatus === "SENT" && !resend) {
    throw new QuoteSendError(
      "This quotation has already been sent.",
      409,
    );
  }

  if (quote.emailStatus === "PENDING") {
    throw new QuoteSendError(
      "An email attempt is already in progress. Check its delivery status before retrying.",
      409,
    );
  }

  // Claim the email attempt atomically.
  const claim = await prisma.quote.updateMany({
    where: {
      id: quoteId,
      status: {
        in: ["ISSUED", "SENT"],
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
    throw new QuoteSendError(
      "Quotation email status changed. Refresh and try again.",
      409,
    );
  }

  try {
    const pdfBlob =
      await quoteStorageService.download(quote.pdfPath);

    const pdfBuffer = Buffer.from(
      await pdfBlob.arrayBuffer(),
    );

    const result = await sendQuoteEmail({
      recipientEmail,
      client: {
        contactName: client.contactName,
        organizationName: client.organizationName,
      },
      quote: {
        reference: quote.reference,
        bookingReference: client.reference,
        courseTitle: client.courseTitle,
        currency: quote.currency,
        totalAmount: quote.totalAmount.toString(),
        issuedAt: quote.issuedAt,
        dueAt: quote.expiresAt,
      },
      pdf: pdfBuffer,
    });

    const sentAt = new Date();

    const updated = await prisma.$transaction(
      async (tx) => {
        const finalized = await tx.quote.updateMany({
          where: {
            id: quoteId,
            emailStatus: "PENDING",
            status: {
              in: ["ISSUED", "SENT"],
            },
          },
          data: {
            status: "SENT",
            emailStatus: "SENT",
            sentAt,
            sentTo: recipientEmail,
          },
        });

        if (finalized.count !== 1) {
          throw new QuoteSendError(
            "Quotation email was submitted, but its status could not be finalized.",
            409,
          );
        }

        if (quote.bookingId) {
          await tx.bookingActivity.create({
            data: {
              bookingId: quote.bookingId,
              type: "QUOTE_SENT",
              description:
                `Quotation ${quote.reference} emailed to ${recipientEmail}.`,
              createdBy: adminUserId,
              metadata: {
                quoteId,
                recipientEmail,
                sentAt: sentAt.toISOString(),
              },
            },
          });
        }

        if (quote.enquiryId) {
          await tx.enquiryActivity.create({
            data: {
              enquiryId: quote.enquiryId,
              type: "QUOTE_SENT",
              description:
                `Quotation ${quote.reference} emailed to ${recipientEmail}.`,
              createdBy: adminUserId,
              metadata: {
                quoteId,
                recipientEmail,
                sentAt: sentAt.toISOString(),
              },
            },
          });
        }

        return tx.quote.findUniqueOrThrow({
          where: { id: quoteId },
          select: {
            id: true,
            reference: true,
            status: true,
            emailStatus: true,
            sentAt: true,
            sentTo: true,
          },
        });
      },
    );

    return {
      quote: updated,
      email: {
        id: result.id,
        to: recipientEmail,
        acceptedAt: sentAt,
        status: "SENT" as const,
      },
    };
  } catch (error) {
    console.error(
      "Quotation email processing failed:",
      error,
    );

    // Keep PENDING because the email may already
    // have been accepted by the provider.
    throw new QuoteSendError(
      "Quotation email processing failed or its outcome could not be confirmed. Check the email provider before retrying.",
      502,
    );
  }
}
