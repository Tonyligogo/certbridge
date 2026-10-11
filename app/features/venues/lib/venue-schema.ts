import z from "zod";

export const venueStatusSchema = z.enum(["ACTIVE", "INACTIVE"]);

export const createVenueSchema = z.object({
  name: z.string().trim().min(2, "Venue name is required").max(200),

  description: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .or(z.literal("")),

  country: z.string().trim().min(2, "Country is required").max(100),

  city: z.string().trim().min(2, "City is required").max(100),

  address: z
    .string()
    .trim()
    .max(300)
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .trim()
    .max(40)
    .optional()
    .or(z.literal("")),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(255)
    .optional()
    .or(z.literal("")),

  website: z
    .string()
    .trim()
    .url("Enter a valid website URL")
    .max(500)
    .optional()
    .or(z.literal("")),

  capacity: z
    .number()
    .int()
    .positive("Capacity must be greater than zero")
    .optional()
    .nullable(),

  notes: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .or(z.literal("")),

  status: venueStatusSchema.optional(),
});

export const updateVenueSchema = z.object({
  name: z.string().trim().min(2).max(200).optional(),

  description: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .or(z.literal("")),

  country: z.string().trim().min(2).max(100).optional(),

  city: z.string().trim().min(2).max(100).optional(),

  address: z
    .string()
    .trim()
    .max(300)
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .trim()
    .max(40)
    .optional()
    .or(z.literal("")),

  email: z
    .string()
    .trim()
    .email()
    .max(255)
    .optional()
    .or(z.literal("")),

  website: z
    .string()
    .trim()
    .url()
    .max(500)
    .optional()
    .or(z.literal("")),

  capacity: z
    .number()
    .int()
    .positive()
    .optional()
    .nullable(),

  notes: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .or(z.literal("")),

  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const addBookingVenueSchema = z.object({
  venueId: z.string().min(1, "Venue ID is required"),

  status: z
    .enum([
      "CONSIDERING",
      "CONTACTED",
      "AVAILABLE",
      "UNAVAILABLE",
      "CONFIRMED",
      "REPLACED",
      "CANCELLED",
    ])
    .optional(),

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
    .length(3, "Currency must be a 3-letter code")
    .optional(),

  notes: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .or(z.literal("")),
});

export const updateBookingVenueSchema = z.object({
  status: z
    .enum([
      "CONSIDERING",
      "CONTACTED",
      "AVAILABLE",
      "UNAVAILABLE",
      "CONFIRMED",
      "REPLACED",
      "CANCELLED",
    ])
    .optional(),

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
    .length(3, "Currency must be a 3-letter code")
    .optional(),

  notes: z
    .string()
    .trim()
    .max(2000)
    .nullable()
    .optional(),
});
