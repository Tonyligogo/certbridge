import { ProfileType } from "@/generated/prisma/enums";
import { z } from "zod";

export const createProfileSchema = z.object({
  type: z.enum(ProfileType),

  displayName: z
    .string()
    .trim()
    .min(2, "Display name must be at least 2 characters.")
    .max(100),

  phone: z
    .string()
    .trim()
    .min(7, "Phone number is too short.")
    .max(20)
    .optional(),

  country: z
    .string()
    .trim()
    .max(100)
    .optional(),

  city: z
    .string()
    .trim()
    .max(100)
    .optional(),

  website: z
    .url("Please enter a valid website.")
    .optional()
    .or(z.literal("")),

  logoUrl: z
    .url("Invalid logo URL.")
    .optional()
    .or(z.literal("")),

  kraPin: z
    .string()
    .trim()
    .max(100)
    .optional(),

  address: z
    .string()
    .trim()
    .max(255)
    .optional(),
});

export const updateProfileSchema = createProfileSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided."
  );