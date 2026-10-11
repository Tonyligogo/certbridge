import { Link, Section, Text } from "react-email";
import { EmailLayout, InfoRow, StatusBadge, colors, styles } from "./email-layout";

// ── Types ────────────────────────────────────────────────────
export interface AdminBookingNotificationEmailProps {
  bookingReference: string;
  courseTitle: string;
  deliveryMode: string;
  preferredStartDate: string;
  preferredEndDate: string;
  participantCount: number;
  contactName: string;
  contactEmail: string;
  contactPhone?: string | null;
  organizationName?: string | null;
  locationCity?: string | null;
  locationCountry?: string | null;
  specialRequirements?: string | null;
  isGuestBooking: boolean;
  participants: {
    firstName: string;
    lastName: string;
    email?: string | null;
    phone?: string | null;
  }[];
  adminUrl?: string;
}

// ── Helpers ──────────────────────────────────────────────────
function formatDeliveryMode(mode: string): string {
  const map: Record<string, string> = {
    ONLINE: "Online (Virtual)",
    ONSITE: "On-Site",
    VENUE:  "Venue (To be arranged)",
  };
  return map[mode] ?? mode;
}

// ── Template ─────────────────────────────────────────────────
export function AdminBookingNotificationEmail({
  bookingReference,
  courseTitle,
  deliveryMode,
  preferredStartDate,
  preferredEndDate,
  participantCount,
  contactName,
  contactEmail,
  contactPhone,
  organizationName,
  locationCity,
  locationCountry,
  specialRequirements,
  isGuestBooking,
  participants,
  adminUrl = "https://trainhub.com/admin/bookings",
}: AdminBookingNotificationEmailProps) {
  const location =
    locationCity && locationCountry
      ? `${locationCity}, ${locationCountry}`
      : locationCity ?? locationCountry ?? null;

  return (
    <EmailLayout
      preview={`New booking: ${courseTitle} · ${participantCount} participant${participantCount !== 1 ? "s" : ""} · Ref: ${bookingReference}`}
    >
      {/* Alert banner */}
      <Section
        style={{
          backgroundColor: colors.primaryLight,
          border: `1px solid ${colors.primary}`,
          borderRadius: "8px",
          padding: "14px 16px",
          marginBottom: "24px",
        }}
      >
        <Text
          style={{
            fontSize: "14px",
            fontWeight: "700",
            color: colors.primary,
            margin: 0,
          }}
        >
          New Booking Request — Action Required
        </Text>
        <Text
          style={{
            fontSize: "13px",
            color: colors.text,
            margin: "4px 0 0 0",
          }}
        >
          A new booking has been submitted and is awaiting your review.
        </Text>
      </Section>

      {/* Heading */}
      <Text style={styles.heading}>{courseTitle}</Text>
      <Section style={{ marginBottom: "20px" }}>
        <StatusBadge label="PENDING REVIEW" bg={colors.amber} />
        {" "}
        {isGuestBooking && (
          <StatusBadge
            label="GUEST BOOKING"
            bg={colors.textMuted}
            color="#fff"
          />
        )}
        <Text
          style={{
            fontSize: "12px",
            color: colors.textMuted,
            margin: "6px 0 0 0",
          }}
        >
          Reference: <strong style={{ color: colors.text }}>{bookingReference}</strong>
        </Text>
      </Section>

      {/* Booking details */}
      <Text style={styles.sectionTitle}>Booking Details</Text>
      <table style={styles.infoTable} cellPadding={0} cellSpacing={0}>
        <tbody>
          <InfoRow label="Course"          value={courseTitle} />
          <InfoRow label="Delivery Mode"   value={formatDeliveryMode(deliveryMode)} />
          <InfoRow label="Preferred Dates" value={`${preferredStartDate} — ${preferredEndDate}`} />
          <InfoRow label="Participants"    value={`${participantCount} ${participantCount === 1 ? "person" : "people"}`} />
          {organizationName && <InfoRow label="Organisation" value={organizationName} />}
          {location          && <InfoRow label="Location"    value={location} />}
        </tbody>
      </table>

      {/* Contact details */}
      <Text style={styles.sectionTitle}>Client Contact</Text>
      <table style={styles.infoTable} cellPadding={0} cellSpacing={0}>
        <tbody>
          <InfoRow label="Name"           value={contactName} />
          <InfoRow label="Email"          value={contactEmail} />
          <InfoRow label="Phone"          value={contactPhone} />
          <InfoRow label="Account type"   value={isGuestBooking ? "Guest (no account)" : "Registered user"} />
        </tbody>
      </table>

      {/* Participants */}
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
                  label={`${i + 1}. ${p.firstName} ${p.lastName}`}
                  value={[p.email, p.phone].filter(Boolean).join(" · ") || "—"}
                />
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Special requirements — highlighted if present */}
      {specialRequirements && (
        <>
          <Text style={styles.sectionTitle}>⚠ Special Requirements</Text>
          <Section
            style={{
              ...styles.alertBox,
              backgroundColor: "#fffbeb",
              borderColor: colors.amber,
            }}
          >
            <Text
              style={{ fontSize: "13px", color: colors.text, margin: 0 }}
            >
              {specialRequirements}
            </Text>
          </Section>
        </>
      )}

      {/* Action items for admin */}
      <Text style={styles.sectionTitle}>Your Action Items</Text>
      <table cellPadding={0} cellSpacing={0} width="100%">
        <tbody>
          {[
            "Review booking details and confirm feasibility",
            deliveryMode === "VENUE"
              ? "Source and confirm a suitable training venue"
              : null,
            "Source and assign an appropriate trainer",
            "Generate a quote and send invoice to the client",
            "Update the booking status in the admin dashboard",
          ]
            .filter(Boolean)
            .map((item, i) => (
              <tr key={i}>
                <td
                  style={{
                    width: "28px",
                    verticalAlign: "top",
                    paddingTop: "10px",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: "18px",
                      height: "18px",
                      borderRadius: "3px",
                      border: `2px solid ${colors.border}`,
                    }}
                  />
                </td>
                <td style={{ paddingTop: "10px", paddingBottom: "2px" }}>
                  <Text
                    style={{
                      fontSize: "13px",
                      color: colors.text,
                      margin: 0,
                    }}
                  >
                    {item}
                  </Text>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* CTA */}
      <Section style={{ marginTop: "32px", textAlign: "center" }}>
        <Link
          href={`${adminUrl}/${bookingReference}`}
          style={styles.button}
        >
          Open Booking in Admin Dashboard →
        </Link>
      </Section>

      <Text
        style={{
          fontSize: "12px",
          color: colors.textMuted,
          marginTop: "16px",
          textAlign: "center",
        }}
      >
        This is an automated notification from Certbridge Global. Do not reply to this email.
      </Text>
    </EmailLayout>
  );
}

export default AdminBookingNotificationEmail;