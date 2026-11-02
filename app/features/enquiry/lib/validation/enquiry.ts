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