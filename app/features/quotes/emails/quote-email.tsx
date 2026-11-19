
import { Section, Text } from "react-email";

import {
  EmailLayout,
  InfoRow,
  colors,
  styles,
} from "@/app/features/emails/email-layout"; // Adjust to your actual path

export interface QuoteEmailProps {
  clientName: string;
  organizationName?: string | null;

  quoteReference: string;
  bookingReference: string;
  courseTitle: string;

  currency: string;
  totalAmount: string;

  issuedAt: string;
  dueAt?: string | null;
}

export function QuoteEmail({
  clientName,
  organizationName,
  quoteReference,
  bookingReference,
  courseTitle,
  currency,
  totalAmount,
  issuedAt,
  dueAt,
}: QuoteEmailProps) {
  return (
    <EmailLayout
      preview={`Quotation ${quoteReference} for ${courseTitle} — CertBridge Global`}
    >
      {/* Greeting */}
      <Text style={styles.heading}>
        Your Training Quotation
      </Text>

      <Text style={styles.subheading}>
        Hello {clientName}, thank you for choosing CertBridge Global.
        Please find attached your quotation for the training programme
        detailed below.
      </Text>

      {/* Invoice reference */}
      <Section style={{ marginBottom: "24px" }}>
        <Text
          style={{
            fontSize: "12px",
            color: colors.textMuted,
            margin: "6px 0 0 0",
          }}
        >
          Quotation Reference:{" "}
          <strong style={{ color: colors.text }}>
            {quoteReference}
          </strong>
        </Text>
      </Section>

      {/* Invoice details */}
      <Text style={styles.sectionTitle}>
        Quotation Details
      </Text>

      <table
        style={styles.infoTable}
        cellPadding={0}
        cellSpacing={0}
      >
        <tbody>
          <InfoRow
            label="Quotation Number"
            value={quoteReference}
          />

          <InfoRow
            label="Booking Reference"
            value={bookingReference}
          />

          <InfoRow
            label="Training Programme"
            value={courseTitle}
          />

          {organizationName && (
            <InfoRow
              label="Organization"
              value={organizationName}
            />
          )}

          <InfoRow
            label="Quotation Date"
            value={issuedAt}
          />

          {dueAt && (
            <InfoRow
              label="Payment Due"
              value={dueAt}
            />
          )}
        </tbody>
      </table>

      {/* Amount due */}
      <Section
        style={{
          backgroundColor: "#f8f9fa",
          border: `1px solid ${colors.border}`,
          borderLeft: `4px solid ${colors.primary}`,
          borderRadius: "6px",
          padding: "18px 20px",
          margin: "24px 0",
        }}
      >
        <Text
          style={{
            fontSize: "12px",
            color: colors.textMuted,
            margin: "0 0 6px",
          }}
        >
          Total Quotation Amount
        </Text>

        <Text
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: colors.primaryDark,
            margin: 0,
          }}
        >
          {currency} {totalAmount}
        </Text>
      </Section>

      {/* Payment reminder */}
      {dueAt && (
        <Section
          style={{
            ...styles.alertBox,
            margin: "16px 0",
          }}
        >
          <Text
            style={{
              fontSize: "13px",
              color: colors.primaryDark,
              margin: 0,
              lineHeight: "1.6",
            }}
          >
            <strong>Response Reminder:</strong> Let us know your response to the quotation before or on <strong>{dueAt}</strong>
          </Text>
        </Section>
      )}

      {/* Closing */}
      <Text
        style={{
          fontSize: "13px",
          color: colors.textMuted,
          lineHeight: "1.7",
          marginTop: "28px",
        }}
      >
        If you have any questions about your quotation or
        require further assistance, simply reply to this email.
      </Text>

      <Text
        style={{
          fontSize: "13px",
          color: colors.text,
          lineHeight: "1.7",
          marginTop: "20px",
        }}
      >
        Kind regards,
        <br />
        <strong>CertBridge Global Team</strong>
      </Text>
    </EmailLayout>
  );
}

export default QuoteEmail;
