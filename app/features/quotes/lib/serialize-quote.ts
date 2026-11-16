import type { Prisma } from "@/generated/prisma/client";

type QuoteWithItems = Prisma.QuoteGetPayload<{
  include: {
    items: {
      orderBy: {
        createdAt: "asc";
      };
    };
  };
}>;

export function serializeQuote(quote: QuoteWithItems) {
  return {
    ...quote,
    taxRate: quote.taxRate.toString(),
    subtotal: quote.subtotal.toString(),
    taxAmount: quote.taxAmount.toString(),
    totalAmount: quote.totalAmount.toString(),

    items: quote.items.map((item) => ({
      ...item,
      quantity: item.quantity.toString(),
      unitPrice: item.unitPrice.toString(),
      amount: item.amount.toString(),
    })),
  };
}