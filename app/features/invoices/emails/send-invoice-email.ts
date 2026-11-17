
import "server-only";

import { sendEmail } from "@/lib/email";
import { InvoiceEmail } from "./invoice-email";

export interface SendInvoiceEmailData {
  recipientEmail: string;

  client: {
    contactName: string;
    organizationName?: string | null;
  };

  invoice: {
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

export async function sendInvoiceEmail(
  data: SendInvoiceEmailData
): Promise<{ id: string }> {
  const { recipientEmail, client, invoice, pdf } = data;

  const result = await sendEmail({
    to: recipientEmail,

    subject: `Invoice ${invoice.reference} — ${invoice.courseTitle}`,

    from: "bookings",

    react: InvoiceEmail({
      clientName: client.contactName,
      organizationName: client.organizationName,

      invoiceReference: invoice.reference,
      bookingReference: invoice.bookingReference,
      courseTitle: invoice.courseTitle,

      currency: invoice.currency,
      totalAmount: formatAmount(invoice.totalAmount),

      issuedAt: formatDate(invoice.issuedAt) ?? "N/A",
      dueAt: formatDate(invoice.dueAt),
    }),

    attachments: [
      {
        filename: `${invoice.reference}.pdf`,
        content: pdf,
        contentType: "application/pdf",
      },
    ],
  });

  return result;
}
