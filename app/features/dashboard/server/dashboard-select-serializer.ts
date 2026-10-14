import type { Prisma } from "@/generated/prisma/client";
import type { BookingWorkflowInput } from "../../booking/types/admin-booking";
import { dashboardWorkflowSelect } from "./dashboard-workflow-select";



type DashboardWorkflowBooking = Prisma.BookingGetPayload<{
  select: typeof dashboardWorkflowSelect;
}>;

function toISO(value: Date | null): string | null {
  return value?.toISOString() ?? null;
}

export function toBookingWorkflowInput(
  booking: DashboardWorkflowBooking
): BookingWorkflowInput {
  return {
    status: booking.status,
    deliveryMode: booking.deliveryMode,

    preferredStartDate: toISO(booking.preferredStartDate),
    preferredEndDate: toISO(booking.preferredEndDate),

    scheduledStartDate: toISO(booking.scheduledStartDate),
    scheduledEndDate: toISO(booking.scheduledEndDate),

    trainers: booking.trainers.map((trainer) => ({
      status: trainer.status,
    })),

    venues: booking.venues.map((venue) => ({
      status: venue.status,
    })),

    quote: booking.quote
      ? {
          status: booking.quote.status,
        }
      : null,

    invoices: booking.invoices.map((invoice) => ({
      id: invoice.id,
      reference: invoice.reference,
      status: invoice.status,
      currency: invoice.currency,
      totalAmount: invoice.totalAmount.toString(),
      issuedAt: toISO(invoice.issuedAt),
      dueAt: toISO(invoice.dueAt),

      payments: invoice.payments.map((payment) => ({
        amount: payment.amount.toString(),
        status: payment.status,
      })),
    })),

    participants: booking.participants.map((participant) => ({
      attended: participant.attended,
      certificateIssued: participant.certificateIssued,
      feedbackSubmitted: participant.feedbackSubmitted,
    })),
  };
}