import {
  Link,
  Section,
  Text,
} from "react-email";
import { EmailLayout, InfoRow, StatusBadge, colors, styles } from "./email-layout";

// ── Types ────────────────────────────────────────────────────
export interface BookingConfirmationEmailProps {
  contactName: string;
  contactEmail: string;
  bookingReference: string;
  courseTitle: string;
  deliveryMode: string;
  preferredStartDate: string;   // pre-formatted e.g. "Monday, 14 July 2025"
  preferredEndDate: string;
  participantCount: number;
  organizationName?: string | null;
  locationCity?: string | null;
  locationCountry?: string | null;
  specialRequirements?: string | null;
  participants: {
    firstName: string;
    lastName: string;
    email?: string | null;
  }[];
  isGuest: boolean;             // true = guest booking, false = account booking
  siteUrl?: string;
}

// ── Helpers ──────────────────────────────────────────────────
function formatDeliveryMode(mode: string): string {
  const map: Record<string, string> = {
    ONLINE: "Online (Virtual)",
    ONSITE: "On-Site (At your location)",
    VENUE:  "At a Venue (Arranged by TrainHub)",
  };
  return map[mode] ?? mode;
}

// ── Template ─────────────────────────────────────────────────
export function BookingConfirmationEmail({
  contactName,
  contactEmail,
  bookingReference,
  courseTitle,
  deliveryMode,
  preferredStartDate,
  preferredEndDate,
  participantCount,
  organizationName,
  locationCity,
  locationCountry,
  specialRequirements,
  participants,
  isGuest,
  siteUrl = "https://certbridgeglobal.com",
}: BookingConfirmationEmailProps) {
  const firstName = contactName.split(" ")[0];
  const location =
    locationCity && locationCountry
      ? `${locationCity}, ${locationCountry}`
      : locationCity ?? locationCountry ?? null;

  return (
    <EmailLayout
      preview={`Booking received — ${courseTitle} · Ref: ${bookingReference}`}
    >
      {/* Greeting */}
      <Text style={styles.heading}>Booking Request Received</Text>
      <Text style={styles.subheading}>
        Hi {firstName}, thank you for your booking request. We have received it
        and our team will review the details and get back to you within{" "}
        <strong>24 hours</strong> to confirm availability and next steps.
      </Text>

      {/* Status badge */}
      <Section style={{ marginBottom: "24px" }}>
        <StatusBadge label="PENDING REVIEW" bg={colors.amber} color="#fff" />
        <Text
          style={{
            fontSize: "14px",
            color: colors.textMuted,
            margin: "6px 0 0 0",
          }}
        >
          Booking Reference:{" "}
          <strong style={{ color: colors.text }}>{bookingReference}</strong>
        </Text>
      </Section>

      {/* Booking details */}
      <Text style={styles.sectionTitle}>Booking Details</Text>
      <table style={styles.infoTable} cellPadding={0} cellSpacing={0}>
        <tbody>
          <InfoRow label="Course"        value={courseTitle} />
          <InfoRow label="Delivery Mode" value={formatDeliveryMode(deliveryMode)} />
          <InfoRow label="Preferred Dates" value={`${preferredStartDate} — ${preferredEndDate}`} />
          <InfoRow label="Participants"  value={`${participantCount} ${participantCount === 1 ? "person" : "people"}`} />
          {organizationName && <InfoRow label="Organisation"  value={organizationName} />}
          {location          && <InfoRow label="Location"     value={location} />}
        </tbody>
      </table>

      {/* Contact details */}
      <Text style={styles.sectionTitle}>Your Contact Details</Text>
      <table style={styles.infoTable} cellPadding={0} cellSpacing={0}>
        <tbody>
          <InfoRow label="Name"  value={contactName} />
          <InfoRow label="Email" value={contactEmail} />
        </tbody>
      </table>

      {/* Participants list */}
      {participants.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>
            Participants ({participants.length})
          </Text>
          <table style={styles.infoTable} cellPadding={0} cellSpacing={0}>
            <tbody>
              {participants.map((p, i) => (
                <InfoRow
                  key={i}
                  label={`${i + 1}.`}
                  value={`${p.firstName} ${p.lastName}${p.email ? ` · ${p.email}` : ""}`}
                />
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Special requirements */}
      {specialRequirements && (
        <>
          <Text style={styles.sectionTitle}>Special Requirements</Text>
          <Section style={styles.alertBox}>
            <Text style={{ fontSize: "13px", color: colors.text, margin: 0 }}>
              {specialRequirements}
            </Text>
          </Section>
        </>
      )}

      {/* CTA — only for guest bookings (no dashboard to link to) */}
      {isGuest ? (
        <Section style={{ marginTop: "32px", textAlign: "center" }}>
          <Text
            style={{
              fontSize: "13px",
              color: colors.textMuted,
              margin: "0 0 16px 0",
            }}
          >
            Want to track this booking and future ones in one place?
          </Text>
          <Link href={`${siteUrl}/sign-up`} style={styles.button}>
            Create a Free Account
          </Link>
        </Section>
      ) : (
        <Section style={{ marginTop: "32px", textAlign: "center" }}>
          <Link
            href={`${siteUrl}/portal`}
            style={styles.button}
          >
            View Booking in Dashboard →
          </Link>
        </Section>
      )}

      {/* Contact line */}
      <Text
        style={{
          fontSize: "13px",
          color: colors.textMuted,
          marginTop: "28px",
          textAlign: "center",
        }}
      >
        Questions? Reply to this email or WhatsApp us at{" "}
        <Link
          href="https://wa.me/254700000000"
          style={{ color: colors.primary }}
        >
          +254 700 000 000
        </Link>
      </Text>
    </EmailLayout>
  );
}

export default BookingConfirmationEmail;