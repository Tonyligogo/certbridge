import { Prisma } from "@/generated/prisma/client";

export const quoteSelect = {
  id: true,
  bookingId: true,

  reference: true,

  status: true,
  currency: true,
  taxRate:true,
  taxType:true,
  subtotal: true,
  taxAmount: true,
  totalAmount: true,

  issuedAt: true,
  expiresAt: true,

  items: {
    select: {
      id: true,
      name: true,
      quantity: true,
      unitPrice: true,
      amount: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  },
  booking: {}

} satisfies Prisma.QuoteSelect;

export type QuoteRecord =
  Prisma.QuoteGetPayload<{
    select: typeof quoteSelect;
  }>;