import type { ReactNode } from "react";
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Link,
} from "react-email";

// ── Design tokens ────────────────────────────────────────────
export const colors = {
  primary: "#0078d4",
  primaryDark: "#005a9e",
  primaryLight: "#e6f2fb",
  green: "#36C5A3",
  amber: "#F4A623",
  text: "#1a1a2e",
  textMuted: "#6b7280",
  border: "#e2e8f0",
  background: "#f8fafc",
  white: "#ffffff",
  red: "#dc2626",
};

export const fonts = {
  body: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
};

// ── Shared layout wrapper ────────────────────────────────────
interface EmailLayoutProps {
  preview: string; // Preview text shown in inbox before email is opened
  children: ReactNode;
}

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <table width="100%" cellPadding={0} cellSpacing={0}>
              <tbody>
                <tr>
                  <td>
                    <table cellPadding={0} cellSpacing={0}>
                      <tbody>
                        <tr>
                          {/* Icon mark — CB circle */}
                          <td
                            style={{
                              width: "36px",
                              height: "36px",
                              backgroundColor: "#020618",
                              borderRadius: "50%",
                              textAlign: "center",
                              verticalAlign: "middle",
                              paddingTop: "2px",
                            }}
                          >
                            <span
                              style={{
                                fontFamily: fonts.body,
                                fontSize: "13px",
                                fontWeight: "900",
                                color: "#ffffff",
                                letterSpacing: "-1px",
                              }}
                            >
                              C<span style={{ color: "#2f92f0" }}>B</span>
                            </span>
                          </td>

                          {/* Wordmark */}
                          <td
                            style={{
                              paddingLeft: "10px",
                              verticalAlign: "middle",
                            }}
                          >
                            <span
                              style={{
                                fontFamily: fonts.body,
                                fontSize: "22px",
                                fontWeight: "700",
                                color: "#0f172b", // slate-950 — dark on white
                                letterSpacing: "-0.5px",
                              }}
                            >
                              CertBridge
                            </span>
                            <span
                              style={{
                                fontFamily: fonts.body,
                                fontSize: "16px",
                                fontWeight: "400",
                                color: "#62748e", // slate-500 — muted on white
                                marginLeft: "5px",
                              }}
                            >
                              Global
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Content */}
          <Section style={styles.content}>{children}</Section>

          {/* Footer */}
          <Hr style={styles.divider} />
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              CertbridgeGlobal — Professional Training, Arranged For You.
            </Text>
            <Text style={styles.footerText}>
              Nairobi, Kenya ·{" "}
              <Link
                href="mailto:info@certbridgeglobal.com"
                style={styles.footerLink}
              >
                info@certbridgeglobal.com
              </Link>
              {" · "}
              <Link
                href="https://certbridgeglobal.com"
                style={styles.footerLink}
              >
                CertbridgeGlobal.com
              </Link>
            </Text>
            <Text
              style={{
                ...styles.footerText,
                marginTop: "8px",
                fontSize: "11px",
              }}
            >
              If this email was wrongfully sent to you, please reach out to us through the methods stated above.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ── Shared components ────────────────────────────────────────

interface InfoRowProps {
  label: string;
  value: string | number | null | undefined;
}

/** A single label + value row inside a details table */
export function InfoRow({ label, value }: InfoRowProps) {
  if (!value) return null;
  return (
    <tr>
      <td style={styles.infoLabel}>{label}</td>
      <td style={styles.infoValue}>{String(value)}</td>
    </tr>
  );
}

interface StatusBadgeProps {
  label: string;
  color?: string;
  bg?: string;
}

export function StatusBadge({
  label,
  color = colors.white,
  bg = colors.primary,
}: StatusBadgeProps) {
  return (
    <span
      style={{
        display: "inline-block",
        backgroundColor: bg,
        color,
        fontSize: "12px",
        fontWeight: "600",
        padding: "3px 10px",
        borderRadius: "12px",
        letterSpacing: "0.4px",
      }}
    >
      {label}
    </span>
  );
}

// ── Styles ───────────────────────────────────────────────────
export const styles = {
  body: {
    backgroundColor: colors.background,
    fontFamily: fonts.body,
    margin: "0",
    padding: "0",
  },
  container: {
    maxWidth: "600px",
    margin: "0px auto",
    backgroundColor: colors.white,
    borderRadius: "12px",
    overflow: "hidden" as const,
    border: `1px solid ${colors.border}`,
  },
  header: {
    backgroundColor: colors.white,
    padding: "24px 32px",
  },
  logoText: {
    color: colors.white,
    fontSize: "24px",
    fontWeight: "700",
    margin: "0",
    letterSpacing: "-0.5px",
  },
  content: {
    padding: "32px",
  },
  heading: {
    color: colors.text,
    fontSize: "22px",
    fontWeight: "700",
    margin: "0 0 8px 0",
    letterSpacing: "-0.3px",
  },
  subheading: {
    color: colors.textMuted,
    fontSize: "15px",
    margin: "0 0 24px 0",
    lineHeight: "1.6",
  },
  sectionTitle: {
    color: colors.text,
    fontSize: "13px",
    fontWeight: "700",
    textTransform: "uppercase" as const,
    letterSpacing: "0.8px",
    margin: "24px 0 12px 0",
    paddingLeft: "12px",
    borderLeft: `3px solid ${colors.primary}`,
  },
  infoTable: {
    width: "100%",
    borderCollapse: "collapse" as const,
    backgroundColor: colors.background,
    borderRadius: "8px",
    overflow: "hidden" as const,
    border: `1px solid ${colors.border}`,
  },
  infoLabel: {
    padding: "10px 14px",
    fontSize: "13px",
    color: colors.textMuted,
    fontWeight: "600",
    width: "40%",
    borderBottom: `1px solid ${colors.border}`,
    verticalAlign: "top" as const,
  },
  infoValue: {
    padding: "10px 14px",
    fontSize: "13px",
    color: colors.text,
    borderBottom: `1px solid ${colors.border}`,
    verticalAlign: "top" as const,
  },
  button: {
    display: "inline-block",
    backgroundColor: colors.primary,
    color: colors.white,
    fontSize: "15px",
    fontWeight: "600",
    padding: "14px 28px",
    borderRadius: "8px",
    textDecoration: "none",
    textAlign: "center" as const,
  },
  alertBox: {
    backgroundColor: colors.primaryLight,
    border: `1px solid ${colors.primary}`,
    borderRadius: "8px",
    padding: "16px",
    margin: "20px 0",
  },
  divider: {
    borderColor: colors.border,
    margin: "0",
  },
  footer: {
    padding: "20px 32px 28px",
    backgroundColor: colors.background,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: "12px",
    margin: "0 0 4px 0",
    lineHeight: "1.6",
    textAlign: "center" as const,
  },
  footerLink: {
    color: colors.primary,
    textDecoration: "none",
  },
} as const;
