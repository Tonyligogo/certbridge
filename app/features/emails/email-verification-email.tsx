import { Link, Section, Text } from "react-email";
import { EmailLayout, colors, styles } from "./email-layout";

interface EmailVerificationEmailProps {
  userName: string;
  verificationUrl: string;
}

export function EmailVerificationEmail({
  userName,
  verificationUrl,
}: EmailVerificationEmailProps) {
  const firstName = userName.split(" ")[0];

  return (
    <EmailLayout preview="Verify your email address — CertBridge Global">
      <Text style={styles.heading}>Verify Your Email Address</Text>
      <Text style={styles.subheading}>
        Hi {firstName}, welcome to CertBridge Global! Please verify your email
        address to activate your account and start booking training courses.
      </Text>

      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <Link href={verificationUrl} style={styles.button}>
          Verify My Email →
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
          {verificationUrl}
        </Text>
      </Section>
      <Text
        style={{
          fontSize: "13px",
          color: colors.textMuted,
          marginTop: "24px",
          lineHeight: "1.6",
        }}
      >
        This verification link expires in <strong>1 hour</strong>. If you did
        not create an account with CertBridge Global, you can safely ignore
        this email.
      </Text>
    </EmailLayout>
  );
}

export default EmailVerificationEmail;