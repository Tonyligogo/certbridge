// lib/validation/decimal.ts

import { z } from "zod";

export const positiveDecimalString = z
  .string()
  .trim()
  .min(1, "Amount is required.")
  .refine(
    (value) => /^\d+(\.\d{1,2})?$/.test(value),
    "Enter a valid amount with up to 2 decimal places."
  )
  .refine(
    (value) => Number(value) > 0,
    "Amount must be greater than zero."
  );

//   zero is allowed here
  export const nonNegativeDecimalString = z
  .string()
  .trim()
  .min(1)
  .refine(
    (value) => /^\d+(\.\d{1,2})?$/.test(value),
    "Enter a valid amount with up to 2 decimal places."
  )
  .refine(
    (value) => Number(value) >= 0,
    "Amount cannot be negative."
  );

//   for quantity
export const quantityDecimalString = z
  .string()
  .trim()
  .min(1, "Quantity is required.")
  .refine(
    (value) => /^\d+(\.\d{1,2})?$/.test(value),
    "Enter a valid quantity."
  )
  .refine(
    (value) => Number(value) > 0,
    "Quantity must be greater than zero."
  );