import { currencySchema } from "@/lib/validation/currency";
import { positiveDecimalString } from "@/lib/validation/decimal";
import z from "zod";

export const recordPaymentSchema = z.object({
  amount: positiveDecimalString,

  currency: currencySchema,

  method: z.enum([
    "BANK_TRANSFER",
    "MOBILE_MONEY",
    "CARD",
    "CASH",
    "CHEQUE",
    "OTHER",
  ]),

  transactionReference: z
    .string()
    .trim()
    .max(200)
    .nullable()
    .optional(),

  paidAt: z
    .iso
    .datetime()
    .nullable()
    .optional(),

  notes: z
    .string()
    .trim()
    .max(2000)
    .nullable()
    .optional(),
});

export type RecordPaymentInput =
  z.infer<typeof recordPaymentSchema>;