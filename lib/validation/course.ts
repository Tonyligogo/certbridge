import { z } from "zod";
import {
  CourseLevel,
  CourseStatus,
  DeliveryMode,
} from "@/generated/prisma/client";

export const courseModuleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Module title is required")
    .max(200),

  description: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  estimatedDuration: z
    .number()
    .int()
    .positive()
    .optional(),
});

export const courseAudienceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Audience name is required")
    .max(200),

  slug: z
    .string()
    .trim()
    .min(3)
    .max(200),
});

export const coursePricingSchema = z.object({
  deliveryMode: z.enum(DeliveryMode),

  amount: z
    .number({
      message: "Amount must be a number",
    })
    .positive("Amount must be greater than zero"),

  currency: z
    .string()
    .trim()
    .default("KES"),
});

export const createCourseSchema = z.object({
  categoryId: z
    .string(),

  title: z
    .string()
    .trim()
    .min(3, "Course title is required")
    .max(200),

  slug: z
    .string()
    .trim()
    .min(3)
    .max(200),

  shortDescription: z
    .string()
    .trim()
    .min(10)
    .max(300),

  description: z
    .string()
    .trim()
    .min(20),

  durationDays: z
    .number()
    .int()
    .positive(),

  level: z.enum(CourseLevel),

  status: z
    .enum(CourseStatus)
    .default(CourseStatus.DRAFT),

  thumbnailUrl: z
    .string()
    .nullable()
    .optional(),

  featured: z
    .boolean()
    .default(false),

  certificateProvided: z
    .boolean()
    .default(false),

  isPopular: z
    .boolean()
    .default(false),

  audiences: z
  .array(z.string())
  .min(1, "Select at least one audience"),

  modules: z
    .array(courseModuleSchema)
    .min(1, "A course must have at least one module"),

  pricing: coursePricingSchema,
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;

export const createCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  slug: z
    .string()
    .min(2, "Slug is required.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens (e.g. safety-management)"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const createAudienceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  slug: z
    .string()
    .min(2, "Slug is required.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens (e.g. executive-managers)"),
});

export type CreateAudienceInput = z.infer<typeof createAudienceSchema>;