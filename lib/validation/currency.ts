import { z } from "zod";

export const currencySchema = z.enum([
  "KES",
  "USD",
  "EUR",
  "GBP",
]);

export type Currency =
  z.infer<typeof currencySchema>;