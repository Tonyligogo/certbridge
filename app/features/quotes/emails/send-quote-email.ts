
import "server-only";

import { sendEmail } from "@/lib/email";
import QuoteEmail from "./quote-email";

export interface SendQuoteEmailData {
  recipientEmail: string;

  client: {
    contactName: string;
    organizationName?: string | null;
  };

  quote: {
    reference: string;
    bookingReference: string;
    courseTitle: string;

    currency: string;
    totalAmount: string;

    issuedAt: Date;
    dueAt?: Date | null;
  };

  pdf: Buffer;
}

function formatDate(
  date: Date | null | undefined
): string | null {
  if (!date) return null;

  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Nairobi",
  }).format(date);
}

function formatAmount(amount: string): string {
  return new Intl.NumberFormat("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

export async function sendQuoteEmail(
  data: SendQuoteEmailData
): Promise<{ id: string }> {
  const { recipientEmail, client, quote, pdf } = data;

  const result = await sendEmail({
    to: recipientEmail,

    subject: `Quote ${quote.reference} — ${quote.courseTitle}`,

    from: "bookings",

    react: QuoteEmail({
      clientName: client.contactName,
      organizationName: client.organizationName,

      quoteReference: quote.reference,
      bookingReference: quote.bookingReference,
      courseTitle: quote.courseTitle,

      currency: quote.currency,
      totalAmount: formatAmount(quote.totalAmount),

      issuedAt: formatDate(quote.issuedAt) ?? "N/A",
      dueAt: formatDate(quote.dueAt),
    }),

    attachments: [
      {
        filename: `${quote.reference}.pdf`,
        content: pdf,
        contentType: "application/pdf",
      },
    ],
  });

  return result;
}
