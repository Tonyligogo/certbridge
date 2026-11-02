import { z } from "zod";

export const createEnquirySchema = z
  .object({
    type: z.enum(["QUOTE", "GENERAL"]),

    fullName: z.string().trim().min(2).max(150),
    email: z.email().max(254),

    phone: z.string().trim().max(40).optional(),
    organization: z.string().trim().max(200).optional(),

    courseId: z.string().trim().max(100).optional(),
    courseName: z.string().trim().max(250).optional(),

    participantCount: z.number().int().min(1).max(10000).optional(),

    deliveryMode: z
      .enum(["ONLINE", "CLIENT_SITE", "ARRANGED_VENUE"])
      .optional(),

    preferredDate: z.iso.date().optional(),

    message: z.string().trim().max(5000).optional(),

    // Honeypot field: legitimate users never fill this.
    website: z.string().max(200).optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.type === "QUOTE" &&
      !data.courseId &&
      !data.courseName?.trim()
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["courseName"],
        message: "Please specify a training course or topic.",
      });
    }

    if (data.type === "GENERAL" && !data.message?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["message"],
        message: "Please enter your message.",
      });
    }
  });

export type CreateEnquiryInput = z.infer<
  typeof createEnquirySchema
>;

export const enquiriesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),

  search: z.string().trim().max(200).optional(),

  status: z.enum([
    "ALL",
    "NEW",
    "PENDING",
    "CONTACTED",
    "IN_PROGRESS",
    "CONVERTED",
    "CLOSED",
  ]).default("ALL"),

  type: z.enum(["ALL", "QUOTE", "GENERAL"]).default("ALL"),

  dateFrom: z.iso.date().optional(),
  dateTo: z.iso.date().optional(),
}).refine(
  (data) => !data.dateFrom || !data.dateTo || data.dateFrom <= data.dateTo,
  { path: ["dateTo"], message: "End date must be on or after start date" }
);

export const changeEnquiryStatusSchema = z.object({
  action: z.literal("CHANGE_STATUS"),
  status: z.enum(["NEW", "CONTACTED", "IN_PROGRESS"]),
});

export const closeEnquirySchema = z.object({
  action: z.literal("CLOSE"),
  reason: z.string().trim().min(5).max(2000),
});

export const reopenEnquirySchema = z.object({
  action: z.literal("REOPEN"),
});

export const updateEnquirySchema = z.discriminatedUnion("action", [
  changeEnquiryStatusSchema,
  closeEnquirySchema,
  reopenEnquirySchema,
]);

export const addEnquiryNoteSchema = z.object({
  note: z.string().trim().min(1).max(5000),
});

export type UpdateEnquiryInput = z.infer<
  typeof updateEnquirySchema
>;

export type AddEnquiryNoteInput = z.infer<
  typeof addEnquiryNoteSchema
>;