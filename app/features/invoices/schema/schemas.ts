import { z } from "zod";

export const createInvoiceSchema = z.object({
  quoteId: z
    .string()
    .trim()
    .min(1)
    .nullable()
    .optional(),

  dueAt: z
    .string()
    .nullable()
    .optional(),

  notes: z
    .string()
    .trim()
    .max(2000)
    .nullable()
    .optional(),
});

// editing the invoice shouldn't allow somebody to arbitrarily switch it to another quote, hence omit quoteId
export const updateInvoiceSchema =
  createInvoiceSchema.omit({
    quoteId: true,
  });

export type CreateInvoiceInput =
  z.infer<typeof createInvoiceSchema>;

export type UpdateInvoiceInput =
  z.infer<typeof updateInvoiceSchema>;