import {
  Prisma,
} from "@/generated/prisma/client";

import type {
  TaxType,
} from "@/generated/prisma/enums";

const TAX_RATES = {
  STANDARD: "16",
  ZERO_RATED: "0",
  EXEMPT: "0",
  NONE: "0",
} satisfies Record<
  TaxType,
  string
>;

export function getTaxRate(
  taxType: TaxType
) {
  return new Prisma.Decimal(
    TAX_RATES[taxType]
  );
}