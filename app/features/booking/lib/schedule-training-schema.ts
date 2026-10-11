import { z } from "zod";

export const scheduleTrainingSchema = z
  .object({
    scheduledStartDate: z.string().min(1, "Scheduled start date is required"),
    scheduledEndDate: z.string().min(1, "Scheduled end date is required"),
  })
  .refine(
    ({ scheduledStartDate, scheduledEndDate }) => {
      return new Date(scheduledEndDate) >= new Date(scheduledStartDate);
    },
    {
      message: "The end date cannot be before the start date.",
      path: ["scheduledEndDate"],
    }
  );

export type ScheduleTrainingSchema = z.infer<
  typeof scheduleTrainingSchema
>;