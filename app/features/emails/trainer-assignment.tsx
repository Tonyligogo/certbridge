import { sendEmail } from "@/lib/email";
import { TrainerAssignmentEmail } from "./trainer-assignment-email";

interface TrainerAssignmentEmailData {
  trainer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  booking: {
    reference: string;
    deliveryMode: string;
    preferredStartDate?: Date | null;
    preferredEndDate?: Date | null;
    scheduledStartDate?: Date | null;
    scheduledEndDate?: Date | null;
    participantCount: number;
    contactName: string;
    organizationName?: string | null;
    locationCity?: string | null;
    locationCountry?: string | null;
    course: {
      title: string;
    };
  };
  assignment: {
    role: string;
    agreedAmount?: string | null; // already stringified Decimal
    currency: string;
    notes?: string | null;
  };
}

function formatDate(date: Date | null | undefined): string | null{
    if(!date) return 'N/A'
  return new Intl.DateTimeFormat("en-KE", {
    weekday: "long",
    day:     "numeric",
    month:   "long",
    year:    "numeric",
  }).format(new Date(date));
}

function formatAmount(amount: string | null | undefined): string | null {
  if (!amount) return null;
  return new Intl.NumberFormat("en-KE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

export async function sendTrainerAssignmentEmail(
  data: TrainerAssignmentEmailData
): Promise<void> {
  const { trainer, booking, assignment } = data;

  // Show org name if present, fall back to contact name
  const clientDisplay = booking.organizationName ?? booking.contactName;

  await sendEmail({
    to:      trainer.email,
    subject: `Training Assignment — ${booking.course.title} [${booking.reference}]`,
    from:    "bookings",
    react:   TrainerAssignmentEmail({
      trainerFirstName:    trainer.firstName,
      trainerLastName:     trainer.lastName,
      courseTitle:         booking.course.title,
      bookingReference:    booking.reference,
      role:                assignment.role,
      clientDisplay,
      participantCount:    booking.participantCount,
      deliveryMode:        booking.deliveryMode,
      preferredStartDate:  formatDate(booking.preferredStartDate),
      preferredEndDate:    formatDate(booking.preferredEndDate),
      scheduledStartDate:  booking.scheduledStartDate
                             ? formatDate(booking.scheduledStartDate)
                             : null,
      scheduledEndDate:    booking.scheduledEndDate
                             ? formatDate(booking.scheduledEndDate)
                             : null,
      locationCity:        booking.locationCity,
      locationCountry:     booking.locationCountry,
      agreedAmount:        formatAmount(assignment.agreedAmount),
      currency:            assignment.currency,
      notes:               assignment.notes,
    }),
  });
}