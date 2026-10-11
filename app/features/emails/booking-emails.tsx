import { sendEmail } from "@/lib/email";
import { AdminBookingNotificationEmail } from "./admin-booking-notification-email";
import BookingConfirmationEmail from "./booking-confirmation";

interface BookingConfirmation {
  id: string;
  reference: string;
  status:  "OPEN" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  
  courseId: string;
  
  deliveryMode: "ONLINE" | "CLIENT_SITE" | "ARRANGED_VENUE";

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
    attended: boolean | null;
    certificateIssued?: boolean;
  }[];

  course: {
    title: string;
  };

  preferredStartDate: string | Date | null;
  preferredEndDate: string | Date | null;
  scheduledStartDate?: string | Date | null;
  scheduledEndDate?: string | Date | null;

  locationCountry: string | null;
  locationCity: string | null;
  locationAddress: string | null;
  locationNotes: string | null;

  specialRequirements: string | null;

  currency: string;

  createdAt: string | Date;
  updatedAt?: string | Date;
  
  profileId: string | null; // Indicates whether it was created by an authenticated user
}

// ── Date formatting ──────────────────────────────────────────
function formatDate(date: string | Date | null): string {
  if (!date) return "N/A";
  return new Intl.DateTimeFormat("en-KE", {
    weekday: "long",
    day:     "numeric",
    month:   "long",
    year:    "numeric",
  }).format(new Date(date));
}

// ── Send client confirmation ─────────────────────────────────
export async function sendBookingConfirmationToClient(
  booking: BookingConfirmation
): Promise<void> {
  const participants = booking.participants.map((bp) => bp);
  const isGuest = booking.profileId === null;

  await sendEmail({
    to:      booking.contactEmail,
    subject: `Booking Request Received — ${booking.course.title} [${booking.reference}]`,
    from:    "bookings",
    react:   BookingConfirmationEmail({
      contactName:        booking.contactName,
      contactEmail:       booking.contactEmail,
      bookingReference:   booking.reference,
      courseTitle:        booking.course.title,
      deliveryMode:       booking.deliveryMode,
      preferredStartDate: formatDate(booking.preferredStartDate),
      preferredEndDate:   formatDate(booking.preferredEndDate),
      participantCount:   booking.participantCount,
      organizationName:   booking.organizationName,
      locationCity:       booking.locationCity,
      locationCountry:    booking.locationCountry,
      specialRequirements: booking.specialRequirements,
      participants,
      isGuest,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    }),
  });
}

// ── Send admin notification ──────────────────────────────────
export async function sendBookingNotificationToAdmin(
  booking: BookingConfirmation
): Promise<void> {
  const adminEmail =
    process.env.ADMIN_NOTIFICATION_EMAIL ?? "bookings@certbridgeglobal.com";

  const participants = booking.participants.map((bp) => bp);

  await sendEmail({
    to:      adminEmail,
    subject: `[New Booking] ${booking.course.title} · ${booking.participantCount} participant${booking.participantCount !== 1 ? "s" : ""} · ${booking.reference}`,
    from:    "bookings",
    react:   AdminBookingNotificationEmail({
      bookingReference:   booking.reference,
      courseTitle:        booking.course.title,
      deliveryMode:       booking.deliveryMode,
      preferredStartDate: formatDate(booking.preferredStartDate),
      preferredEndDate:   formatDate(booking.preferredEndDate),
      participantCount:   booking.participantCount,
      contactName:        booking.contactName,
      contactEmail:       booking.contactEmail,
      contactPhone:       booking.contactPhone,
      organizationName:   booking.organizationName,
      locationCity:       booking.locationCity,
      locationCountry:    booking.locationCountry,
      specialRequirements: booking.specialRequirements,
      isGuestBooking:     booking.profileId === null,
      participants,
      adminUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/bookings`,
    }),
  });
}

// ── Send both at once ────────────────────────────────────────
/**
 * Sends the client confirmation and admin notification concurrently.
 * Errors are caught individually so one failure doesn't block the other.
 * Both results are returned so the caller can log or handle them.
 */
export async function sendBookingEmails(booking: BookingConfirmation): Promise<{
  clientEmailSent: boolean;
  adminEmailSent: boolean;
  errors: string[];
}> {
  const errors: string[] = [];

  const [clientResult, adminResult] = await Promise.allSettled([
    sendBookingConfirmationToClient(booking),
    sendBookingNotificationToAdmin(booking),
  ]);

  if (clientResult.status === "rejected") {
    errors.push(`Client email failed: ${clientResult.reason?.message}`);
    console.error("Failed to send client booking confirmation:", clientResult.reason);
  }

  if (adminResult.status === "rejected") {
    errors.push(`Admin email failed: ${adminResult.reason?.message}`);
    console.error("Failed to send admin booking notification:", adminResult.reason);
  }

  return {
    clientEmailSent: clientResult.status === "fulfilled",
    adminEmailSent:  adminResult.status === "fulfilled",
    errors,
  };
}