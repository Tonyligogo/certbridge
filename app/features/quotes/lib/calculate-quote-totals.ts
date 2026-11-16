import { Prisma } from "@/generated/prisma/client";
import { getTaxRate } from "../../booking/lib/tax";

type QuoteItemInput = {
  name: string;
  quantity: string;
  unitPrice: string;
};

const roundMoney = (value: Prisma.Decimal) =>
  value.toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);

export function calculateQuoteTotals(
  items: QuoteItemInput[],
  taxType: Parameters<typeof getTaxRate>[0],
) {
  const calculatedItems = items.map((item) => {
    const quantity = new Prisma.Decimal(item.quantity);
    const unitPrice = new Prisma.Decimal(item.unitPrice);

    return {
      name: item.name,
      quantity,
      unitPrice,
      amount: roundMoney(quantity.mul(unitPrice)),
    };
  });

  const subtotal = calculatedItems.reduce(
    (sum, item) => sum.add(item.amount),
    new Prisma.Decimal(0),
  );

  const taxRate = new Prisma.Decimal(getTaxRate(taxType));
  const taxAmount = subtotal.mul(taxRate).div(100);
  const totalAmount = subtotal.add(taxAmount);

  return {
    calculatedItems,
    taxRate,
    subtotal,
    taxAmount,
    totalAmount,
  };
}