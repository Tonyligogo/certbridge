import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import type { InvoicePdfData } from "../../invoices/pdf/invoice-pdf-data";

export type QuotePdfRecord = Prisma.QuoteGetPayload<{
  include: {
    items: true;
    booking: {
      include: {
        course: true;
      };
    };
    enquiry: {
      include: {
        course: true;
      };
    };
  };
}>;

type QuotePdfOverrides = {
  issuedAt?: Date | null;
};

export function mapQuoteToPdfData(
  quote: QuotePdfRecord,
  overrides: QuotePdfOverrides = {},
): InvoicePdfData {
  const booking = quote.booking;
  const enquiry = quote.enquiry;

  if (!booking && !enquiry) {
    throw new Error(
      "Quotation must be associated with a booking or enquiry.",
    );
  }

  const issuedAt =
    overrides.issuedAt !== undefined
      ? overrides.issuedAt
      : quote.issuedAt;

  const client = booking
    ? {
        organizationName: booking.organizationName,
        contactName: booking.contactName,
        email: booking.contactEmail,
        phone: booking.contactPhone,
      }
    : {
        organizationName: enquiry!.organization,
        contactName: enquiry!.fullName,
        email: enquiry!.email,
        phone: enquiry!.phone,
      };

  const courseTitle = booking
    ? booking.course.title
    : enquiry!.course?.title ?? enquiry!.courseName;

  return {
    reference: quote.reference,

    bookingReference: booking
      ? booking.reference
      : enquiry!.reference,

    client,

    courseTitle: courseTitle ?? "Training Programme",

    currency: quote.currency,
    taxType: quote.taxType,
    taxRate: quote.taxRate.toString(),

    subtotal: quote.subtotal.toString(),
    taxAmount: quote.taxAmount.toString(),
    totalAmount: quote.totalAmount.toString(),

    issuedAt: issuedAt?.toISOString() ?? null,
    dueAt: quote.expiresAt?.toISOString() ?? null,

    notes: quote.responseNotes,

    items: quote.items.map((item) => ({
      name: item.name,
      quantity: item.quantity.toString(),
      unitPrice: item.unitPrice.toString(),
      amount: item.amount.toString(),
    })),
  };
}