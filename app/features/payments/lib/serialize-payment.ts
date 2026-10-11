import type { Payment } from "../types/payments";
import type { PaymentRecord } from "./payment-select";

export function serializePayment(
  payment: PaymentRecord
): Payment {
  return {
    ...payment,

    amount: payment.amount.toString(),

    paidAt:
      payment.paidAt?.toISOString() ?? null,

    createdAt:
      payment.createdAt.toISOString(),

    updatedAt:
      payment.updatedAt.toISOString(),
  };
}