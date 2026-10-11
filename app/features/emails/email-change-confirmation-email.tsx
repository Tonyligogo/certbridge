import { Link, Section, Text } from "react-email";
import { EmailLayout, colors, styles } from "./email-layout";

interface EmailChangeConfirmationEmailProps {
  userName: string;
  currentEmail: string;
  newEmail: string;
  confirmationUrl: string;
}

export function EmailChangeConfirmationEmail({
  userName,
  currentEmail,
  newEmail,
  confirmationUrl,
}: EmailChangeConfirmationEmailProps) {
  const firstName = userName.split(" ")[0];

  return (
    <EmailLayout preview="Confirm your email address change — CertBridge Global">
      <Text style={styles.heading}>Confirm Your Email Change</Text>
      <Text style={styles.subheading}>
        Hi {firstName}, we received a request to change the email address on
        your CertBridge Global account. Click the button below to approve this
        change.
      </Text>

      {/* Change summary */}
      <Text style={styles.sectionTitle}>Requested Change</Text>
      <table style={styles.infoTable} cellPadding={0} cellSpacing={0}>
        <tbody>
          <tr>
            <td style={styles.infoLabel}>Current email</td>
            <td style={styles.infoValue}>{currentEmail}</td>
          </tr>
          <tr>
            <td style={styles.infoLabel}>New email</td>
            <td
              style={{
                ...styles.infoValue,
                color: colors.primary,
                fontWeight: "600",
              }}
            >
              {newEmail}
            </td>
          </tr>
        </tbody>
      </table>

      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <Link href={confirmationUrl} style={styles.button}>
          Confirm Email Change →
        </Link>
      </Section>

      <Section
        style={{
          backgroundColor: colors.background,
          border: `1px solid ${colors.border}`,
          borderRadius: "8px",
          padding: "16px",
          margin: "24px 0",
        }}
      >
        <Text
          style={{ fontSize: "13px", color: colors.textMuted, margin: "0 0 4px 0" }}
        >
          Or copy and paste this link into your browser:
        </Text>
        <Text
          style={{
            fontSize: "12px",
            color: colors.primary,
            margin: 0,
            wordBreak: "break-all",
          }}
        >
          {confirmationUrl}
        </Text>
      </Section>

      {/* Security warning */}
      <Section
        style={{
          backgroundColor: "#fef3cd",
          border: "1px solid #f4a623",
          borderRadius: "8px",
          padding: "16px",
          margin: "0 0 20px 0",
        }}
      >
        <Text
          style={{
            fontSize: "13px",
            fontWeight: "700",
            color: "#92400e",
            margin: "0 0 4px 0",
          }}
        >
          ⚠ Did not request this change?
        </Text>
        <Text style={{ fontSize: "13px", color: "#92400e", margin: 0 }}>
          If you did not request this email change, your account may be
          compromised. Contact us immediately at{" "}
          <Link
            href="mailto:support@certbridgeglobal.com"
            style={{ color: "#92400e", fontWeight: "600" }}
          >
            support@certbridgeglobal.com
          </Link>
        </Text>
      </Section>

      <Text
        style={{
          fontSize: "13px",
          color: colors.textMuted,
          lineHeight: "1.6",
        }}
      >
        This confirmation link expires in <strong>1 hour</strong>. Until you
        confirm, your current email address ({currentEmail}) remains active.
      </Text>
    </EmailLayout>
  );
}

export default EmailChangeConfirmationEmail;