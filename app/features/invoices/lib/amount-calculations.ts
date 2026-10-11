import { Prisma } from "@/generated/prisma/client";
import { TAX_RATE } from "@/lib/utils";

interface InvoiceItemInput {
  name: string;
  quantity: string;
  unitPrice: string;
}

export function calculateInvoice(
  items: InvoiceItemInput[]
) {
  const calculatedItems = items.map((item) => {
    const quantity =
      new Prisma.Decimal(item.quantity);

    const unitPrice =
      new Prisma.Decimal(item.unitPrice);

    const amount =
      quantity.mul(unitPrice);

    return {
      name: item.name,
      quantity,
      unitPrice,
      amount,
    };
  });

  const subtotal = calculatedItems.reduce(
    (total, item) => total.add(item.amount),
    new Prisma.Decimal(0)
  );

  // Same 16% VAT we've currently been using.
  const taxRate = new Prisma.Decimal(TAX_RATE);

  const taxAmount =
    subtotal.mul(taxRate);

  const totalAmount =
    subtotal.add(taxAmount);

  return {
    items: calculatedItems,
    subtotal,
    taxAmount,
    totalAmount,
  };
}