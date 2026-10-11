import { z } from "zod";

export const quoteItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(500, "Description is too long"),

  quantity: z
  .string()
  .trim()
  .regex(
    /^\d+(\.\d{1,2})?$/,
    "Amount must be a valid number with up to 2 decimal places"
  ),

  unitPrice: z
  .string()
  .trim()
  .regex(
    /^\d+(\.\d{1,2})?$/,
    "Amount must be a valid number with up to 2 decimal places"
  ),

});

export const createQuoteSchema = z.object({
  expiresAt: z
    .string()
    .nullable()
    .optional(),

  responseNotes: z
    .string()
    .trim()
    .max(2000, "Response notes are too long")
    .nullable()
    .optional(),

  taxType: z.enum([
    "STANDARD",
    "ZERO_RATED",
    "EXEMPT",
    "NONE",
  ]),

  items: z
    .array(quoteItemSchema)
    .min(1, "At least one quote item is required"),
});

export const updateQuoteSchema = z.object({
  expiresAt: z
    .string()
    .nullable()
    .optional(),

  responseNotes: z
    .string()
    .trim()
    .max(2000, "Response notes are too long")
    .nullable()
    .optional(),

  taxType: z.enum([
    "STANDARD",
    "ZERO_RATED",
    "EXEMPT",
    "NONE",
  ]),

  items: z
    .array(quoteItemSchema)
    .min(1, "At least one quote item is required")
    .optional(),
});

export const updateQuoteStatusSchema = z.object({
  status: z.enum([
    "DRAFT",
    "SENT",
    "ACCEPTED",
    "DECLINED",
    "EXPIRED",
    "CANCELLED",
  ]),

  responseNotes: z
    .string()
    .trim()
    .max(2000, "Response notes are too long")
    .nullable()
    .optional(),
});