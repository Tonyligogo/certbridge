
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
  };
}>;

type QuotePdfOverrides = {
  issuedAt?: Date | null;
};

export function mapQuoteToPdfData(
  invoice: QuotePdfRecord,
  overrides: QuotePdfOverrides = {}
): InvoicePdfData {
  const issuedAt =
    overrides.issuedAt !== undefined
      ? overrides.issuedAt
      : invoice.issuedAt;

  return {
    reference: invoice.reference,

    bookingReference: invoice.booking.reference,

    client: {
      organizationName: invoice.booking.organizationName,
      contactName: invoice.booking.contactName,
      email: invoice.booking.contactEmail,
      phone: invoice.booking.contactPhone,
    },

    courseTitle: invoice.booking.course.title,

    currency: invoice.currency,
    taxType: invoice.taxType,
    taxRate: invoice.taxRate.toString(),

    subtotal: invoice.subtotal.toString(),
    taxAmount: invoice.taxAmount.toString(),
    totalAmount: invoice.totalAmount.toString(),

    issuedAt: issuedAt?.toISOString() ?? null,
    dueAt: invoice.expiresAt?.toISOString() ?? null,

    notes: invoice.responseNotes,

    items: invoice.items.map((item) => ({
      name: item.name,
      quantity: item.quantity.toString(),
      unitPrice: item.unitPrice.toString(),
      amount: item.amount.toString(),
    })),
  };
}
