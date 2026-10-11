import { Link, Section, Text } from "react-email";
import { EmailLayout, colors, styles } from "./email-layout";

interface PasswordResetEmailProps {
  userName: string;
  resetUrl: string;
}

export function PasswordResetEmail({ userName, resetUrl }: PasswordResetEmailProps) {
  const firstName = userName.split(" ")[0];

  return (
    <EmailLayout preview="Reset your CertBridge Global password">
      <Text style={styles.heading}>Reset Your Password</Text>
      <Text style={styles.subheading}>
        Hi {firstName}, we received a request to reset the password for your
        CertBridge Global account. Click the button below to choose a new password.
      </Text>

      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <Link href={resetUrl} style={styles.button}>
          Reset My Password →
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
          {resetUrl}
        </Text>
      </Section>

      <Text
        style={{
          fontSize: "13px",
          color: colors.textMuted,
          margin: "20px 0 0 0",
          lineHeight: "1.6",
        }}
      >
        This link expires in <strong>1 hour</strong>. If you did not request a
        password reset, you can safely ignore this email — your password will
        not be changed.
      </Text>

      <Text
        style={{
          fontSize: "13px",
          color: colors.textMuted,
          marginTop: "12px",
          lineHeight: "1.6",
        }}
      >
        If you&apos;re having trouble, contact us at{" "}
        <Link
          href="mailto:info@certbridgeglobal.com"
          style={{ color: colors.primary }}
        >
          info@certbridgeglobal.com
        </Link>
      </Text>
    </EmailLayout>
  );
}

export default PasswordResetEmail;