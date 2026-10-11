import type { Invoice } from "../types/invoice";
import type { InvoiceRecord } from "./invoice-select";

export function serializeInvoice(
  invoice: InvoiceRecord
): Invoice {
  return {
    ...invoice,

    subtotal: invoice.subtotal.toString(),
    taxAmount: invoice.taxAmount.toString(),
    totalAmount: invoice.totalAmount.toString(),

    issuedAt: invoice.issuedAt?.toISOString() ?? null,
    dueAt: invoice.dueAt?.toISOString() ?? null,
    createdAt: invoice.createdAt.toISOString(),
    updatedAt: invoice.updatedAt.toISOString(),

    items: invoice.items.map((item) => ({
      ...item,

      quantity: item.quantity.toString(),
      unitPrice: item.unitPrice.toString(),
      amount: item.amount.toString(),

      createdAt: item.createdAt.toISOString(),
    })),

    payments: invoice.payments.map((payment) => ({
      ...payment,

      amount: payment.amount.toString(),

      paidAt: payment.paidAt?.toISOString() ?? null,
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString(),
    })),
  };
}