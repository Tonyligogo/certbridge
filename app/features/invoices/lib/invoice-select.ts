import { Prisma } from "@/generated/prisma/client";

export const invoiceSelect = {
  id: true,
  bookingId: true,
  quoteId: true,

  reference: true,

  status: true,
  currency: true,
  taxRate:true,
  taxType:true,
  subtotal: true,
  taxAmount: true,
  totalAmount: true,

  issuedAt: true,
  dueAt: true,
  notes: true,

  createdAt: true,
  updatedAt: true,

  items: {
    select: {
      id: true,
      name: true,
      quantity: true,
      unitPrice: true,
      amount: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  },

  payments: {
    select: {
      id: true,
      reference: true,
      amount: true,
      currency: true,
      method: true,
      status: true,
      transactionReference: true,
      paidAt: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  },
} satisfies Prisma.InvoiceSelect;

export type InvoiceRecord =
  Prisma.InvoiceGetPayload<{
    select: typeof invoiceSelect;
  }>;