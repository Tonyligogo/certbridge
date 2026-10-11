import { ResourceSourcingStatus } from "@/generated/prisma/enums";
import { z } from "zod";

export const trainerStatusSchema = z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]);

export const trainerCertificationStatusSchema = z.enum([
  "PENDING",
  "VALID",
  "EXPIRED",
  "REJECTED",
]);

export const trainerAssignmentRoleSchema = z.enum(["LEAD", "ASSISTANT"]);
export const trainerAssignmentStatusSchema = z.enum([ "CONSIDERING","CONTACTED","AVAILABLE","UNAVAILABLE","CONFIRMED","REPLACED","CANCELLED" ]);

export const createTrainerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(60),

  lastName: z.string().trim().min(1, "Last name is required").max(60),

  email: z.email("Enter a valid email address").max(255),

  phone: z.string().trim().min(6, "Phone number is required").max(40),

  primaryCountry: z.string().trim().max(80).optional().nullable(),

  primaryCity: z.string().trim().max(80).optional().nullable(),

  expertise: z.string().trim().max(2000).optional().nullable(),

  yearsOfExperience: z.number().int().min(0).max(100).optional().nullable(),

  languages: z.string().trim().max(1000).optional().nullable(),

  status: trainerStatusSchema.optional(),

  certified: z.boolean().optional(),

  courseIds: z.array(z.string().trim().min(1)).max(200).default([]),
});

export const updateTrainerSchema = createTrainerSchema
  .omit({
    courseIds: true,
  })
  .partial();

export const updateTrainerCoursesSchema = z.object({
  courseIds: z.array(z.string().trim().min(1)).max(200),
});

export const createTrainerCertificationSchema = z.object({
  name: z.string().trim().min(1, "Certification name is required").max(200),

  issuedBy: z.string().trim().max(200).optional().nullable(),

  issuedAt: z.coerce.date().optional().nullable(),

  expiresAt: z.coerce.date().optional().nullable(),

  storagePath: z.string().trim().min(1, "Storage path is required").max(1000),

  status: trainerCertificationStatusSchema.optional(),

});

export const updateTrainerCertificationSchema = createTrainerCertificationSchema
  .extend({
    status: trainerCertificationStatusSchema.optional(),
  })
  .partial();

export const assignTrainerSchema = z.object({
  trainerId: z.string().trim().min(1, "Trainer is required"),

  role: trainerAssignmentRoleSchema.optional(),

  status:trainerAssignmentStatusSchema,

  agreedAmount: z
  .string()
  .trim()
  .regex(
    /^\d+(\.\d{1,2})?$/,
    "Amount must be a valid number with up to 2 decimal places"
  ),

  currency: z.string().trim().length(3).default("KES"),
  assignedAt: z.coerce.date().optional(),

  notes: z.string().trim().max(5000).optional().nullable(),
});

export type CreateTrainerInput = z.infer<typeof createTrainerSchema>;
export type UpdateTrainerInput = z.infer<typeof updateTrainerSchema>;
export type UpdateTrainerCoursesInput = z.infer<
  typeof updateTrainerCoursesSchema
>;
export type CreateTrainerCertificationInput = z.infer<
  typeof createTrainerCertificationSchema
>;
export type UpdateTrainerCertificationInput = z.infer<
  typeof updateTrainerCertificationSchema
>;
export type AssignTrainerInput = z.infer<typeof assignTrainerSchema>;

export const updateTrainerAssignmentSchema = z.object({
  agreedAmount: z
    .string()
    .trim()
    .regex(
      /^\d+(\.\d{1,2})?$/,
      "Amount must be a valid number with up to 2 decimal places"
    )
    .nullable()
    .optional(),

  currency: z
    .string()
    .trim()
    .min(3)
    .max(3)
    .optional(),

  status: z.enum(ResourceSourcingStatus).optional(),
});
export type UpdateAssignedTrainerInput = z.infer<typeof updateTrainerAssignmentSchema>;
