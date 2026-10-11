import { Link, Section, Text } from "react-email";
import { EmailLayout, InfoRow, colors, styles } from "./email-layout";

export interface TrainerAssignmentEmailProps {
  trainerFirstName: string;
  trainerLastName: string;
  courseTitle: string;
  bookingReference: string;
  role: string;
  clientDisplay: string;       // org name if present, otherwise contact name
  participantCount: number;
  deliveryMode: string;
  scheduledStartDate?: string | null;
  scheduledEndDate?: string | null;
  preferredStartDate?: string | null;
  preferredEndDate?: string | null;
  locationCity?: string | null;
  locationCountry?: string | null;
  agreedAmount?: string | null; // pre-formatted e.g. "KES 25,000"
  currency: string;
  notes?: string | null;
  siteUrl?: string;
}

function formatDeliveryMode(mode: string): string {
  const map: Record<string, string> = {
    ONLINE: "Online (Virtual)",
    ONSITE: "On-Site (At client location)",
    VENUE:  "At a Venue (To be confirmed)",
  };
  return map[mode] ?? mode;
}

export function TrainerAssignmentEmail({
  trainerFirstName,
  courseTitle,
  bookingReference,
  clientDisplay,
  participantCount,
  deliveryMode,
  scheduledStartDate,
  scheduledEndDate,
  preferredStartDate,
  preferredEndDate,
  locationCity,
  locationCountry,
  agreedAmount,
  currency,
  notes,
  siteUrl = "https://certbridgeglobal.com",
}: TrainerAssignmentEmailProps) {
  const location =
    locationCity && locationCountry
      ? `${locationCity}, ${locationCountry}`
      : locationCity ?? locationCountry ?? null;

  // Use scheduled dates if confirmed, fall back to preferred
  const dateDisplay =
    scheduledStartDate && scheduledEndDate
      ? `${scheduledStartDate} — ${scheduledEndDate}`
      : `${preferredStartDate} — ${preferredEndDate} (preferred, to be confirmed)`;

  const isDateConfirmed = !!(scheduledStartDate && scheduledEndDate);

  return (
    <EmailLayout
      preview={`You have been assigned to deliver ${courseTitle} · Ref: ${bookingReference}`}
    >
      {/* Greeting */}
      <Text style={styles.heading}>You Have Been Assigned a Training</Text>
      <Text style={styles.subheading}>
        Hi {trainerFirstName}, you have been selected to deliver the following
        training. Please review the details below and reach out to us if you
        have any questions before the session.
      </Text>

      <Section style={{ marginBottom: "24px" }}>
        <Text
          style={{
            fontSize: "12px",
            color: colors.textMuted,
            margin: "6px 0 0 0",
          }}
        >
          Booking Reference:{" "}
          <strong style={{ color: colors.text }}>{bookingReference}</strong>
        </Text>
      </Section>

      {/* Training details — client info kept minimal intentionally */}
      <Text style={styles.sectionTitle}>Training Details</Text>
      <table style={styles.infoTable} cellPadding={0} cellSpacing={0}>
        <tbody>
          <InfoRow label="Course"          value={courseTitle} />
          <InfoRow label="Delivery Mode"   value={formatDeliveryMode(deliveryMode)} />
          <InfoRow label="Date"            value={dateDisplay} />
          <InfoRow label="Participants"    value={`${participantCount} ${participantCount === 1 ? "person" : "people"}`} />
          <InfoRow label="Client"          value={clientDisplay} />
          {location && <InfoRow label="Location" value={location} />}
        </tbody>
      </table>

      {/* Date confirmation notice */}
      {!isDateConfirmed && (
        <Section
          style={{
            ...styles.alertBox,
            margin: "16px 0",
          }}
        >
          <Text style={{ fontSize: "13px", color: colors.primaryDark, margin: 0 }}>
            <strong>Note:</strong> The date above is the client&apos;s preferred
            date and has not been confirmed yet. We will notify you once the
            final date is locked in. Please keep this window available.
          </Text>
        </Section>
      )}

      {/* Compensation — only shown if agreedAmount is set */}
      {agreedAmount && (
        <>
          <Text style={styles.sectionTitle}>Your Compensation</Text>
          <table style={styles.infoTable} cellPadding={0} cellSpacing={0}>
            <tbody>
              <InfoRow
                label="Agreed Amount"
                value={`${currency} ${agreedAmount}`}
              />
              <InfoRow
                label="Payment"
                value="Processed within 7 days of training completion"
              />
            </tbody>
          </table>
        </>
      )}

      {/* Admin notes to trainer — only shown if present */}
      {notes && (
        <>
          <Text style={styles.sectionTitle}>Notes from Our Team</Text>
          <Section
            style={{
              backgroundColor: "#f8f9fa",
              border: `1px solid ${colors.border}`,
              borderLeft: `4px solid ${colors.primary}`,
              borderRadius: "6px",
              padding: "14px 16px",
              margin: "0 0 20px 0",
            }}
          >
            <Text
              style={{ fontSize: "13px", color: colors.text, margin: 0, lineHeight: "1.6" }}
            >
              {notes}{" "}Ensure your training materials are ready at least 48 hours before the session.
            </Text>
          </Section>
        </>
      )}

      {/* Contact line */}
      <Text
        style={{
          fontSize: "13px",
          color: colors.textMuted,
          marginTop: "28px",
          textAlign: "center",
          lineHeight: "1.6",
        }}
      >
        Questions about this assignment? Reply to this email or reach us on{" "}
        <Link
          href="https://wa.me/254700000000"
          style={{ color: colors.primary }}
        >
          WhatsApp
        </Link>
        .
      </Text>
    </EmailLayout>
  );
}

export default TrainerAssignmentEmail;