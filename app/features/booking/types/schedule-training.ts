import type { BookingStatus } from "@/generated/prisma/browser";

export interface ScheduleTrainingInput {
  scheduledStartDate: string;
  scheduledEndDate: string;
}

export interface ScheduleTrainingResponse {
  id: string;
  reference: string;
  status: BookingStatus;
  scheduledStartDate: string;
  scheduledEndDate: string;
  updatedAt: string;
}

export interface ScheduleTrainingVariables {
  bookingId: string;
  data: ScheduleTrainingInput;
}