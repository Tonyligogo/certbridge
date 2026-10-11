import { z } from "zod";
import { BookingStatus } from "./pricing";

export const deliveryModeEnum = z.enum([
  "ONLINE",
  "CLIENT_SITE",
  "ARRANGED_VENUE",
]);

export const participantSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(60),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(60),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(255),

  phone: z
    .string()
    .trim()
    .min(6, "Enter a valid phone number")
    .max(40),
});

export const contactSchema = z.object({
  contactName: z
    .string()
    .trim()
    .min(2, "Contact name is required")
    .max(120),

  contactEmail: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(255),

  contactPhone: z
    .string()
    .trim()
    .min(6, "Phone number is required")
    .max(40),

  organizationName: z
    .union([
      z.string().trim().max(160),
      z.literal(""),
    ])
    .optional()
    .transform((val) => val || undefined),
});

export const bookingRequestSchema = z
  .object({
    courseId: z
      .string()
      .trim()
      .min(1, "Course ID is required"),

       quotedAmount: z
    .number({
      message: "Quoted amount must be a number",
    })
    .positive("Quoted amount must be greater than zero"),

    deliveryMode: deliveryModeEnum,

    participants: z
      .array(participantSchema)
      .min(1, "Add at least one participant")
      .max(200),

    preferredStartDate: z
      .string()
      .min(1, "Preferred start date is required"),

    preferredEndDate: z
      .string()
      .min(1, "Preferred end date is required"),

    locationCountry: z
      .union([
        z.string().trim().max(80),
        z.literal(""),
      ])
      .optional()
      .transform((val) => val || undefined),

    locationCity: z
      .union([
        z.string().trim().max(80),
        z.literal(""),
      ])
      .optional()
      .transform((val) => val || undefined),

    locationAddress: z
      .union([
        z.string().trim().max(240),
        z.literal(""),
      ])
      .optional()
      .transform((val) => val || undefined),

    locationNotes: z
      .union([
        z.string().trim().max(1000),
        z.literal(""),
      ])
      .optional()
      .transform((val) => val || undefined),

    specialRequirements: z
      .union([
        z.string().trim().max(2000),
        z.literal(""),
      ])
      .optional()
      .transform((val) => val || undefined),
  })
  .and(contactSchema)
  .refine(
    (data) =>
      new Date(data.preferredEndDate) >=
      new Date(data.preferredStartDate),
    {
      message:
        "Preferred end date must be on or after the preferred start date",
      path: ["preferredEndDate"],
    },
  );

export type BookingRequestInput = z.infer<
  typeof bookingRequestSchema
>;

export type CreateBookingPayload = BookingRequestInput;

export interface BookingConfirmation {
  id: string;
  reference: string;
  status: BookingStatus;
  
  courseId: string;
  
  deliveryMode: "ONLINE" | "CLIENT_SITE" | "ARRANGED_VENUE";

  contactName: string;
  contactEmail: string;
  contactPhone: string;
  organizationName: string | null;

  participantCount: number;
  participants: {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    attended: boolean | null;
    certificateIssued?: boolean;
  }[];

  preferredStartDate: string | Date | null;
  preferredEndDate: string | Date | null;
  scheduledStartDate?: string | Date | null;
  scheduledEndDate?: string | Date | null;

  locationCountry: string | null;
  locationCity: string | null;
  locationAddress: string | null;
  locationNotes: string | null;

  specialRequirements: string | null;

  currency: string;

  createdAt: string | Date;
  updatedAt?: string | Date;
  
  profileId: string | null; // Indicates whether it was created by an authenticated user
}