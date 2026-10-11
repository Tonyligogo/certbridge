import { Prisma } from "@/generated/prisma/client";

export const paymentSelect = {
  id: true,
  invoiceId: true,
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
} satisfies Prisma.PaymentSelect;

export type PaymentRecord =
  Prisma.PaymentGetPayload<{
    select: typeof paymentSelect;
  }>;