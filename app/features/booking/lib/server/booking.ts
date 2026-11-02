import { getBookingByReference } from "../db/booking";

export async function getBooking(reference: string) {
  return getBookingByReference(reference);
}

interface CompletionParticipant {
  attendanceMarkedAt: Date | null;
}

interface CompletionBooking {
  status: string;
  scheduledEndDate: Date | null;
  participants: CompletionParticipant[];
}

export function validateBookingCompletion(
  booking: CompletionBooking
) {
  const reasons: string[] = [];

  if (booking.status !== "CONFIRMED") {
    reasons.push("Only confirmed bookings can be completed.");
  }

  if (!booking.scheduledEndDate) {
    reasons.push("The booking must have a scheduled end date.");
  } else if (booking.scheduledEndDate > new Date()) {
    reasons.push("The scheduled training period has not ended.");
  }

  if (booking.participants.length === 0) {
    reasons.push("The booking has no registered participants.");
  } else if (
    booking.participants.some(
      (participant) => participant.attendanceMarkedAt == null
    )
  ) {
    reasons.push(
      "Attendance must be recorded for all participants."
    );
  }

  return {
    canComplete: reasons.length === 0,
    reasons,
  };
}