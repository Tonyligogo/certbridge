import { z } from "zod";

const decimalSchema = z
  .string()
  .trim()
  .regex(
    /^\d+(\.\d{1,2})?$/,
    "Enter a valid number with up to 2 decimal places",
  );

export const quoteItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(500, "Description is too long"),

  quantity: decimalSchema.refine(
    (value) => Number(value) > 0,
    "Quantity must be greater than zero",
  ),

  unitPrice: decimalSchema.refine(
    (value) => Number(value) >= 0,
    "Unit price cannot be negative",
  ),
});

export const createQuoteSchema = z
  .object({
    expiresAt: z.coerce.date().nullable().optional(),

    responseNotes: z
      .string()
      .trim()
      .max(2000, "Response notes are too long")
      .nullable()
      .optional(),

    taxType: z.enum(["STANDARD", "ZERO_RATED", "EXEMPT", "NONE"]),

    status: z.enum(["DRAFT", "ISSUED"]),

    items: z
      .array(quoteItemSchema)
      .min(1, "At least one quote item is required"),
  })
  .superRefine((data, ctx) => {
    if (data.status === "ISSUED" && !data.expiresAt) {
      ctx.addIssue({
        code: "custom",
        path: ["expiresAt"],
        message: "An expiry date is required to issue a quotation.",
      });
    }
  });

export const updateQuoteSchema = z.object({
  expiresAt: z.coerce.date().nullable().optional(),

  responseNotes: z
    .string()
    .trim()
    .max(2000, "Response notes are too long")
    .nullable()
    .optional(),

  taxType: z.enum(["STANDARD", "ZERO_RATED", "EXEMPT", "NONE"]),

  items: z
    .array(quoteItemSchema)
    .min(1, "At least one quote item is required")
    .optional(),
});

export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;

export type UpdateQuoteInput = z.infer<typeof updateQuoteSchema>;

export const updateQuoteStatusSchema = z.object({
  status: z.enum(["ACCEPTED", "DECLINED"]),

  responseNotes: z
    .string()
    .trim()
    .max(2000, "Response notes are too long")
    .nullable()
    .optional(),
});

export const voidQuoteSchema = z
  .object({
    reason: z.string().trim().min(5).max(1000),
  })
  .strict();