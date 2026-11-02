import { z } from "zod";

export const recordAttendanceSchema = z.object({
  participants: z
    .array(
      z.object({
        participantId: z.string().min(1),
        attended: z.boolean(),
      })
    )
    .min(1, "Select at least one participant."),
});

export type RecordAttendanceInput = z.infer<
  typeof recordAttendanceSchema
>;