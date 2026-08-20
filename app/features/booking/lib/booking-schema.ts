import { z } from "zod";

// Delivery mode enum matching Prisma model / database standard
export const deliveryModeEnum = z.enum(["ONLINE", "CLIENT_SITE", "OUR_VENUE"]);

export const participantSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(60),
  lastName: z.string().trim().min(1, "Last name is required").max(60),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z.string().trim().min(6, "Enter a valid phone number").max(40),
});

export const contactSchema = z.object({
  contactName: z.string().trim().min(2, "Contact name is required").max(120),
  contactEmail: z.string().trim().email("Enter a valid email address").max(255),
  contactPhone: z.string().trim().min(6, "Phone number is required").max(40),
  organizationName: z
    .union([z.string().trim().max(160), z.literal("")])
    .optional()
    .transform((val) => val || undefined),
});

export const bookingRequestSchema = z
  .object({
    courseId: z.string().trim().min(1, "Course ID or slug is required"),
    deliveryMode: deliveryModeEnum,
    
    // Auto-calculated or length validated from participants array
    participantCount: z.number().int().min(1, "At least one participant is required"),
    participants: z
      .array(participantSchema)
      .min(1, "Add at least one participant")
      .max(200),

    // Preferred training dates provided by customer
    preferredStartDate: z
      .union([z.string(), z.string().trim().max(20), z.literal("")])
      .optional()
      .transform((val) => (val ? new Date(val) : undefined)),
    preferredEndDate: z
      .union([z.string(), z.string().trim().max(20), z.literal("")])
      .optional()
      .transform((val) => (val ? new Date(val) : undefined)),

    // Physical training location
    locationCountry: z
      .union([z.string().trim().max(80), z.literal("")])
      .optional()
      .transform((val) => val || undefined),
    locationCity: z
      .union([z.string().trim().max(80), z.literal("")])
      .optional()
      .transform((val) => val || undefined),
    locationAddress: z
      .union([z.string().trim().max(240), z.literal("")])
      .optional()
      .transform((val) => val || undefined),
    locationNotes: z
      .union([z.string().trim().max(1000), z.literal("")])
      .optional()
      .transform((val) => val || undefined),

    specialRequirements: z
      .union([z.string().trim().max(2000), z.literal("")])
      .optional()
      .transform((val) => val || undefined),
  })
  .and(contactSchema);

export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;

export interface BookingConfirmation {
  id: string;
  reference: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  
  courseId: string;
  courseTitle: string;
  
  deliveryMode: "ONLINE" | "CLIENT_SITE" | "OUR_VENUE";

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
    attended?: boolean;
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

  quotedAmount: number | string | null;
  finalAmount: number | string | null;
  currency: string;

  createdAt: string | Date;
  updatedAt?: string | Date;
  
  profileId: string | null; // Indicates whether it was created by an authenticated user
}