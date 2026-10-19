
import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import type { InvoicePdfData } from "./invoice-pdf-data";

export type InvoicePdfRecord = Prisma.InvoiceGetPayload<{
  include: {
    items: true;
    booking: {
      include: {
        course: true;
      };
    };
  };
}>;

type InvoicePdfOverrides = {
  status?: InvoicePdfData["status"];
  issuedAt?: Date | null;
};

export function mapInvoiceToPdfData(
  invoice: InvoicePdfRecord,
  overrides: InvoicePdfOverrides = {}
): InvoicePdfData {
  const issuedAt =
    overrides.issuedAt !== undefined
      ? overrides.issuedAt
      : invoice.issuedAt;

  return {
    reference: invoice.reference,
    status: overrides.status ?? invoice.status,

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
    dueAt: invoice.dueAt?.toISOString() ?? null,

    notes: invoice.notes,

    items: invoice.items.map((item) => ({
      name: item.name,
      quantity: item.quantity.toString(),
      unitPrice: item.unitPrice.toString(),
      amount: item.amount.toString(),
    })),
  };
}
