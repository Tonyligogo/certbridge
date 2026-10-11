import {
  Body,
  Container,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Link,
} from "react-email";

// ── Types (inline — matches exactly what the route sends) ─────────────────────

interface QuoteItemEmail {
  id:        string;
  name:      string;
  quantity:  string;
  unitPrice: string;
  amount:    string;
}

interface QuoteEmail {
  id:        string;
  reference: string;
  issuedAt:  Date | string | null;
  expiresAt: Date | string | null;
  items:     QuoteItemEmail[];
}

interface BookingCourseEmail {
  id:    string;
  title: string;
  slug:  string;
}

interface BookingEmail {
  id:                  string;
  reference:           string;
  organizationName:    string | null;
  contactName:         string;
  contactEmail:        string;
  contactPhone:        string;
  deliveryMode:        string;
  participantCount:    number;
  currency:            string;
  preferredStartDate:  Date | string | null;
  preferredEndDate:    Date | string | null;
  scheduledStartDate:  Date | string | null;
  scheduledEndDate:    Date | string | null;
  locationAddress:     string | null;
  locationCity:        string | null;
  locationCountry:     string | null;
  locationNotes:       string | null;
  specialRequirements: string | null;
  course:              BookingCourseEmail;
}

export interface QuotationEmailProps {
  quote:   QuoteEmail;
  booking: BookingEmail;
}

// ── Formatting helpers ────────────────────────────────────────────────────────

function fmtDate(d: Date | string | null): string {
  if (!d) return "—";
  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric", month: "long", year: "numeric",
  }).format(new Date(d));
}

function fmtMoney(amount: string | null | undefined, currency = "KES"): string {
  if (!amount) return "—";
  const n = parseFloat(amount);
  if (isNaN(n)) return "—";
  return `${currency} ${new Intl.NumberFormat("en-KE", {
    minimumFractionDigits: 0, maximumFractionDigits: 2,
  }).format(n)}`;
}

function fmtPhone(phone: string): string {
  const c = phone.replace(/\s/g, "");
  return c.startsWith("0") ? `+254 ${c.slice(1)}` : phone;
}

function deliveryLabel(mode: string): string {
  const map: Record<string, string> = {
    ONLINE:       "Online (Virtual)",
    ARRANGED_VENUE:    "At Our Venue",
    CLIENT_SITE: "At Client Venue",
  };
  return map[mode] ?? mode;
}

// ── Design tokens ─────────────────────────────────────────────────────────────

const c = {
  blue:       "#0078d4",
  blueDark:   "#005a9e",
  blueDarker: "#003f73",
  blueLight:  "#eff6ff",
  blueBorder: "#bfdbfe",
  ink:        "#0f172a",
  ink2:       "#1e293b",
  ink3:       "#334155",
  muted:      "#64748b",
  muted2:     "#94a3b8",
  rule:       "#e2e8f0",
  rule2:      "#f1f5f9",
  white:      "#ffffff",
  green:      "#059669",
  greenLight: "#d1fae5",
  greenBorder:"#6ee7b7",
  amber:      "#d97706",
  amberLight: "#fef3c7",
  amberBorder:"#fde68a",
};

const font = "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

// ── Shared style objects ──────────────────────────────────────────────────────

const s = {
  body: {
    backgroundColor: "#e8edf2",
    fontFamily: font,
    margin: "0",
    padding: "40px 16px 60px",
    WebkitPrintColorAdjust: "exact" as const,
  },
  container: {
    maxWidth: "640px",
    margin: "0 auto",
    backgroundColor: c.white,
    border: `1px solid ${c.rule}`,
  },
  topRule: {
    height: "5px",
    background: `linear-gradient(90deg,${c.blueDarker},${c.blue},#38bdf8)`,
    lineHeight: "5px",
    fontSize: "1px",
  },
  // parties strip
  partyCol: {
    padding: "22px 24px",
    verticalAlign: "top" as const,
    width: "33.33%",
  },
  partyRole: {
    fontSize: "9px",
    fontWeight: "700",
    letterSpacing: "1px",
    textTransform: "uppercase" as const,
    color: c.blue,
    marginBottom: "10px",
  },
  partyName: {
    fontSize: "14px",
    fontWeight: "700",
    color: c.ink,
    marginBottom: "6px",
    lineHeight: "1.3",
  },
  pRowLabel: {
    fontSize: "11px",
    color: c.muted,
    width: "72px",
    display: "inline-block" as const,
    verticalAlign: "top" as const,
  },
  pRowValue: {
    fontSize: "11px",
    color: c.ink3,
    fontWeight: "500",
  },
  // section label
  secLabel: {
    fontSize: "9px",
    fontWeight: "700",
    letterSpacing: "0.9px",
    textTransform: "uppercase" as const,
    color: c.muted2,
    margin: "0 0 12px 0",
    borderBottom: `1px solid ${c.rule}`,
    paddingBottom: "6px",
  },
  // table
  th: {
    fontSize: "9px",
    fontWeight: "700",
    letterSpacing: "0.6px",
    textTransform: "uppercase" as const,
    color: c.muted,
    padding: "0 8px 8px",
    borderBottom: `2px solid ${c.ink}`,
    textAlign: "left" as const,
  },
  thRight: {
    fontSize: "9px",
    fontWeight: "700",
    letterSpacing: "0.6px",
    textTransform: "uppercase" as const,
    color: c.muted,
    padding: "0 0 8px",
    borderBottom: `2px solid ${c.ink}`,
    textAlign: "right" as const,
  },
  td: {
    fontSize: "12.5px",
    color: c.ink3,
    padding: "12px 8px",
    borderBottom: `1px solid ${c.rule2}`,
    verticalAlign: "top" as const,
  },
  tdRight: {
    fontSize: "12.5px",
    color: c.ink3,
    padding: "12px 0",
    borderBottom: `1px solid ${c.rule2}`,
    textAlign: "right" as const,
    fontVariantNumeric: "tabular-nums" as const,
    verticalAlign: "top" as const,
  },
};

// ── Info row helper ───────────────────────────────────────────────────────────

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  if (!value) return null;
  return (
    <tr>
      <td
        style={{
          ...s.td,
          ...s.pRowLabel,
          width: "100px",
          padding: "3px 8px 3px 0",
          borderBottom: "none",
          color: c.muted,
          fontSize: "11px",
        }}
      >
        {label}
      </td>
      <td
        style={{
          ...s.td,
          padding: "3px 0",
          borderBottom: "none",
          fontSize: "11px",
          color: c.ink3,
          fontWeight: "500",
        }}
      >
        {value}
      </td>
    </tr>
  );
}

// ── Main template ─────────────────────────────────────────────────────────────

export function QuotationEmail({ quote, booking }: QuotationEmailProps) {
  const co = {
    name:         "CertBridge Global Ltd",
    kraPin:       "P051234567M",
    email:        "bookings@certbridgeglobal.com",
    phone:        "+254 700 000 000",
    website:      "certbridgeglobal.com",
    paybill:      "123456",
    bankName:     "Equity Bank Kenya",
    accountName:  "CertBridge Global Ltd",
    accountNo:    "0123456789",
    branch:       "Upper Hill, Nairobi",
  };

  const clientName    = booking.organizationName ?? booking.contactName;
  const issuedDate    = fmtDate(quote.issuedAt);
  const startDate     = booking.scheduledStartDate ?? booking.preferredStartDate;
  const endDate       = booking.scheduledEndDate   ?? booking.preferredEndDate;
  const dateConfirmed = !!booking.scheduledStartDate;

  const location = [
    booking.locationAddress,
    booking.locationCity,
    booking.locationCountry,
  ].filter(Boolean).join(", ");

  const subtotal = quote.items.reduce(
    (sum, item) => sum + parseFloat(item.amount), 0
  );

  const hasExpiry = !!quote.expiresAt;

  return (
    <Html lang="en">
      <Preview>
        Your quotation {quote.reference} for {booking.course.title} —{" "}
        {fmtMoney(
          quote.items
            .reduce((s, i) => s + parseFloat(i.amount), 0)
            .toString(),
          booking.currency
        )}{" "}
        total
      </Preview>

      <Body style={s.body}>
        <Container style={s.container}>

          {/* ── Top gradient rule ── */}
          <div style={s.topRule}>&nbsp;</div>

          {/* ══ HEADER ══ */}
          <Section style={{ padding: "28px 32px 24px", borderBottom: `1px solid ${c.rule}` }}>
            <table width="100%" cellPadding={0} cellSpacing={0}>
              <tbody>
                <tr>
                  {/* Logo */}
                  <td style={{ verticalAlign: "middle" }}>
                    <table cellPadding={0} cellSpacing={0}>
                      <tbody>
                        <tr>
                          <td
                            style={{
                              width: "36px",
                              height: "36px",
                              backgroundColor: c.ink,
                              borderRadius: "50%",
                              textAlign: "center",
                              verticalAlign: "middle",
                              paddingTop: "2px",
                            }}
                          >
                            <span style={{ fontSize: "12px", fontWeight: "900", color: c.white, letterSpacing: "-1px", fontFamily: font }}>
                              C<span style={{ color: "#60a5fa" }}>B</span>
                            </span>
                          </td>
                          <td style={{ paddingLeft: "10px", verticalAlign: "middle" }}>
                            <div style={{ fontSize: "16px", fontWeight: "700", color: c.ink, letterSpacing: "-0.3px", lineHeight: "1.2", fontFamily: font }}>
                              CertBridge Global
                            </div>
                            <div style={{ fontSize: "10px", color: c.muted, fontFamily: font }}>
                              Professional Training · Arranged For You
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  {/* Document heading */}
                  <td style={{ textAlign: "right", verticalAlign: "middle" }}>
                    <div style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "1.2px", textTransform: "uppercase", color: c.muted, fontFamily: font }}>
                      Document Type
                    </div>
                    <div style={{ fontSize: "26px", fontWeight: "800", color: c.ink, letterSpacing: "-1px", lineHeight: "1.1", fontFamily: font }}>
                      Quotation
                    </div>
                    <div style={{ fontSize: "11.5px", color: c.muted, marginTop: "4px", lineHeight: "1.6", fontFamily: font }}>
                      Ref <strong style={{ color: c.ink2 }}>{quote.reference}</strong>
                      <br />
                      Issued <strong style={{ color: c.ink2 }}>{issuedDate}</strong>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* ══ VALIDITY NOTICE ══ */}
          <Section
            style={{
              backgroundColor: hasExpiry ? c.amberLight : c.rule2,
              borderBottom: `1px solid ${hasExpiry ? c.amberBorder : c.rule}`,
              padding: "9px 32px",
            }}
          >
            <Text
              style={{
                fontSize: "11.5px",
                color: hasExpiry ? c.amber : c.muted,
                margin: 0,
                fontFamily: font,
              }}
            >
              {hasExpiry ? (
                <>
                  ⏳ This quotation is valid until{" "}
                  <strong style={{ color: "#92400e" }}>{fmtDate(quote.expiresAt)}</strong>
                  {" "}— please confirm acceptance before this date.
                </>
              ) : (
                <>
                  No expiry set —{" "}
                  <strong style={{ color: c.ink3 }}>
                    please confirm acceptance at your earliest convenience
                  </strong>{" "}
                  to secure your preferred training dates.
                </>
              )}
            </Text>
          </Section>

          {/* ══ PARTIES STRIP ══ */}
          <Section style={{ borderBottom: `1px solid ${c.rule}` }}>
            <table width="100%" cellPadding={0} cellSpacing={0}>
              <tbody>
                <tr>
                  {/* Billed To */}
                  <td style={{ ...s.partyCol, borderRight: `1px solid ${c.rule}` }}>
                    <div style={s.partyRole}>Billed To</div>
                    <div style={s.partyName}>{clientName}</div>
                    <table cellPadding={0} cellSpacing={0}>
                      <tbody>
                        <InfoRow label="Contact" value={booking.contactName} />
                        <InfoRow label="Email"   value={booking.contactEmail} />
                        <InfoRow label="Phone"   value={fmtPhone(booking.contactPhone)} />
                        {location && <InfoRow label="Location" value={location} />}
                      </tbody>
                    </table>
                  </td>

                  {/* Quotation details */}
                  <td style={{ ...s.partyCol, borderRight: `1px solid ${c.rule}` }}>
                    <div style={s.partyRole}>Quotation Details</div>
                    <table cellPadding={0} cellSpacing={0}>
                      <tbody>
                        <InfoRow label="Quote Ref"   value={quote.reference} />
                        <InfoRow label="Booking Ref" value={booking.reference} />
                        <InfoRow label="Issued"      value={issuedDate} />
                        <InfoRow label="Currency"    value={booking.currency} />
                        <InfoRow label="Status"      value="Sent" />
                      </tbody>
                    </table>
                  </td>

                  {/* Issued By */}
                  <td style={s.partyCol}>
                    <div style={s.partyRole}>Issued By</div>
                    <div style={s.partyName}>{co.name}</div>
                    <table cellPadding={0} cellSpacing={0}>
                      <tbody>
                        <InfoRow label="Email"   value={co.email} />
                        <InfoRow label="Phone"   value={co.phone} />
                        <InfoRow label="KRA PIN" value={co.kraPin} />
                        <InfoRow label="Website" value={co.website} />
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* ══ BODY ══ */}
          <Section style={{ padding: "28px 32px" }}>

            {/* Training summary */}
            <Text style={s.secLabel}>Training Overview</Text>
            <Section
              style={{
                backgroundColor: c.blueLight,
                border: `1px solid ${c.blueBorder}`,
                borderLeft: `4px solid ${c.blue}`,
                borderRadius: "3px",
                padding: "16px 18px",
                marginBottom: "20px",
              }}
            >
              <Text style={{ fontSize: "14px", fontWeight: "700", color: c.ink, margin: "0 0 6px", lineHeight: "1.3", fontFamily: font }}>
                {booking.course.title}
              </Text>
              <table cellPadding={0} cellSpacing={0} width="100%">
                <tbody>
                  <tr>
                    <td style={{ fontSize: "11.5px", color: c.muted, paddingRight: "16px", paddingTop: "2px", fontFamily: font }}>
                      {fmtDate(startDate)} – {fmtDate(endDate)}
                      {!dateConfirmed && (
                        <span style={{ fontStyle: "italic", marginLeft: "4px" }}>(preferred)</span>
                      )}
                    </td>
                    {location && (
                      <td style={{ fontSize: "11.5px", color: c.muted, paddingRight: "16px", paddingTop: "2px", fontFamily: font }}>
                        {location}
                      </td>
                    )}
                    <td style={{ fontSize: "11.5px", color: c.muted, paddingTop: "2px", fontFamily: font }}>
                      {booking.participantCount} {booking.participantCount === 1 ? "participant" : "participants"}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div style={{ marginTop: "10px" }}>
                <span style={{ display: "inline-block", fontSize: "10px", fontWeight: "700", letterSpacing: "0.3px", padding: "3px 10px", borderRadius: "3px", backgroundColor: c.blue, color: c.white, fontFamily: font }}>
                  {deliveryLabel(booking.deliveryMode)}
                </span>
              </div>
            </Section>

            {/* ── Line items table ── */}
            <Text style={s.secLabel}>Line Items</Text>
            <table width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: "0" }}>
              <thead>
                <tr>
                  <th style={{ ...s.th, paddingLeft: "0" }}>Description</th>
                  <th style={{ ...s.th, textAlign: "center" as const }}>Qty</th>
                  <th style={{ ...s.th, textAlign: "right" as const }}>Unit Price</th>
                  <th style={{ ...s.thRight }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {quote.items.map((item) => (
                  <tr key={item.id}>
                    <td style={{ ...s.td, paddingLeft: "0" }}>
                      <div style={{ fontWeight: "600", color: c.ink, fontFamily: font }}>
                        {item.name}
                      </div>
                    </td>
                    <td style={{ ...s.td, textAlign: "center" as const, color: c.muted }}>
                      {parseInt(item.quantity, 10)}
                    </td>
                    <td style={{ ...s.tdRight, paddingRight: "8px" }}>
                      {fmtMoney(item.unitPrice, booking.currency)}
                    </td>
                    <td style={s.tdRight}>
                      <strong style={{ color: c.ink }}>
                        {fmtMoney(item.amount, booking.currency)}
                      </strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <table width="100%" cellPadding={0} cellSpacing={0} style={{ marginTop: "0", borderTop: `2px solid ${c.ink}`, paddingTop: "14px" }}>
              <tbody>
                <tr>
                  <td />
                  <td style={{ width: "260px" }}>
                    <table width="100%" cellPadding={0} cellSpacing={0}>
                      <tbody>
                        <tr>
                          <td style={{ fontSize: "12px", color: c.muted, padding: "4px 0", fontFamily: font }}>Subtotal</td>
                          <td style={{ fontSize: "12px", color: c.ink3, textAlign: "right", padding: "4px 0", fontVariantNumeric: "tabular-nums", fontFamily: font }}>
                            {fmtMoney(String(subtotal), booking.currency)}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ fontSize: "12px", color: c.muted, padding: "4px 0", fontFamily: font }}>
                            VAT (16%)
                          </td>
                          <td style={{ fontSize: "12px", color: c.muted, textAlign: "right", padding: "4px 0", fontFamily: font }}>
                            KES 0 <span style={{ fontSize: "10px" }}>(exempt)</span>
                          </td>
                        </tr>
                        {/* Grand total */}
                        <tr>
                          <td colSpan={2} style={{ paddingTop: "8px" }}>
                            <table width="100%" cellPadding={0} cellSpacing={0}>
                              <tbody>
                                <tr>
                                  <td
                                    style={{
                                      backgroundColor: c.ink,
                                      padding: "11px 14px",
                                      borderRadius: "3px 0 0 3px",
                                    }}
                                  >
                                    <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.65)", fontFamily: font }}>
                                      Total Due
                                    </span>
                                  </td>
                                  <td
                                    style={{
                                      backgroundColor: c.ink,
                                      padding: "11px 14px",
                                      textAlign: "right",
                                      borderRadius: "0 3px 3px 0",
                                    }}
                                  >
                                    <span style={{ fontSize: "17px", fontWeight: "800", color: c.white, letterSpacing: "-0.5px", fontVariantNumeric: "tabular-nums", fontFamily: font }}>
                                      {fmtMoney(
                                        quote.items
                                          .reduce((s, i) => s + parseFloat(i.amount), 0)
                                          .toString(),
                                        booking.currency
                                      )}
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* ── Payment details ── */}
            <Section
              style={{
                backgroundColor: c.rule2,
                border: `1px solid ${c.rule}`,
                borderRadius: "3px",
                padding: "18px 20px",
                marginTop: "24px",
                marginBottom: "20px",
              }}
            >
              <Text style={{ ...s.secLabel, borderColor: "#bfdbfe", color: c.blue, marginBottom: "14px" }}>
                Payment Instructions
              </Text>
              <table width="100%" cellPadding={0} cellSpacing={0}>
                <tbody>
                  <tr>
                    <td style={{ width: "50%", verticalAlign: "top", paddingBottom: "10px" }}>
                      <div style={{ fontSize: "10px", color: c.muted, marginBottom: "2px", fontFamily: font }}>Bank</div>
                      <div style={{ fontSize: "12.5px", fontWeight: "600", color: c.ink, fontFamily: font }}>{co.bankName}</div>
                    </td>
                    <td style={{ width: "50%", verticalAlign: "top", paddingBottom: "10px" }}>
                      <div style={{ fontSize: "10px", color: c.muted, marginBottom: "2px", fontFamily: font }}>Account Name</div>
                      <div style={{ fontSize: "12.5px", fontWeight: "600", color: c.ink, fontFamily: font }}>{co.accountName}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "50%", verticalAlign: "top", paddingBottom: "10px" }}>
                      <div style={{ fontSize: "10px", color: c.muted, marginBottom: "2px", fontFamily: font }}>Account No.</div>
                      <div style={{ fontSize: "12.5px", fontWeight: "600", color: c.ink, fontFamily: font }}>{co.accountNo}</div>
                    </td>
                    <td style={{ width: "50%", verticalAlign: "top", paddingBottom: "10px" }}>
                      <div style={{ fontSize: "10px", color: c.muted, marginBottom: "2px", fontFamily: font }}>M-Pesa Paybill</div>
                      <div style={{ fontSize: "12.5px", fontWeight: "600", color: c.ink, fontFamily: font }}>
                        {co.paybill} · Acc: {quote.reference}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} style={{ verticalAlign: "top" }}>
                      <div style={{ fontSize: "10px", color: c.muted, marginBottom: "2px", fontFamily: font }}>Payment Terms</div>
                      <div style={{ fontSize: "12px", fontWeight: "500", color: c.ink3, fontFamily: font }}>
                        50% deposit required to confirm booking · Balance due 7 days before training date
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* ── Notes ── */}
            <table width="100%" cellPadding={0} cellSpacing={0}>
              <tbody>
                <tr>
                  <td style={{ width: "50%", verticalAlign: "top", paddingRight: "10px" }}>
                    <div style={{ border: `1px solid ${c.rule}`, borderRadius: "3px", padding: "16px 18px" }}>
                      <div style={{ ...s.secLabel, marginBottom: "10px" }}>Notes</div>
                      <Text style={{ fontSize: "12px", color: c.ink3, lineHeight: "1.65", margin: 0, fontFamily: font }}>
                        This quotation is prepared for{" "}
                        <strong style={{ color: c.ink }}>{clientName}</strong> for{" "}
                        <strong style={{ color: c.ink }}>{booking.course.title}</strong>.
                        The total of{" "}
                        <strong style={{ color: c.ink }}>
                          {fmtMoney(
                            quote.items.reduce((s, i) => s + parseFloat(i.amount), 0).toString(),
                            booking.currency
                          )}
                        </strong>{" "}
                        reflects the agreed amount. Use reference{" "}
                        <strong style={{ color: c.ink }}>{quote.reference}</strong>{" "}
                        in all payment communications.
                      </Text>
                    </div>
                  </td>
                  <td style={{ width: "50%", verticalAlign: "top", paddingLeft: "10px" }}>
                    <div style={{ border: `1px solid ${c.rule}`, borderRadius: "3px", padding: "16px 18px" }}>
                      <div style={{ ...s.secLabel, marginBottom: "10px" }}>Terms &amp; Conditions</div>
                      {[
                        "50% deposit required to confirm and secure the booking.",
                        "Balance due 7 days before the training start date.",
                        "Cancellations within 7 days forfeit the deposit.",
                        "Rescheduling permitted with 14 days' notice at no charge.",
                        "Certificates issued within 5 business days of completion.",
                        "All prices are in Kenya Shillings (KES).",
                      ].map((t, i) => (
                        <div key={i} style={{ display: "flex", gap: "6px", marginBottom: "5px" }}>
                          <span style={{ color: c.blue, flexShrink: 0, fontSize: "11px", fontFamily: font }}>›</span>
                          <Text style={{ fontSize: "11.5px", color: c.ink3, margin: 0, lineHeight: "1.5", fontFamily: font }}>{t}</Text>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* ── CTA ── */}
            <Section style={{ textAlign: "center", marginTop: "28px" }}>
              <Text style={{ fontSize: "13px", color: c.muted, margin: "0 0 14px", fontFamily: font }}>
                Questions about this quotation? Reply to this email or reach us directly.
              </Text>
              <Link
                href={`mailto:${co.email}?subject=Re: Quotation ${quote.reference}`}
                style={{
                  display: "inline-block",
                  backgroundColor: c.blue,
                  color: c.white,
                  fontSize: "13px",
                  fontWeight: "600",
                  padding: "12px 28px",
                  borderRadius: "4px",
                  textDecoration: "none",
                  fontFamily: font,
                }}
              >
                Reply to This Quotation
              </Link>
            </Section>

          </Section>

          {/* ══ FOOTER ══ */}
          <Hr style={{ borderColor: c.rule, margin: "0" }} />
          <Section style={{ backgroundColor: c.rule2, padding: "16px 32px" }}>
            <table width="100%" cellPadding={0} cellSpacing={0}>
              <tbody>
                <tr>
                  <td style={{ verticalAlign: "middle" }}>
                    <Text style={{ fontSize: "11px", color: c.muted, margin: 0, lineHeight: "1.7", fontFamily: font }}>
                      <strong style={{ color: c.ink3 }}>{co.name}</strong> · Registered in Kenya · KRA PIN: {co.kraPin}
                      <br />{co.email} · {co.phone} · {co.website}
                    </Text>
                  </td>
                  <td style={{ textAlign: "right", verticalAlign: "middle" }}>
                    <Text style={{ fontSize: "11px", fontWeight: "700", color: c.blue, margin: "0 0 2px", fontFamily: font }}>
                      Professional Training, Arranged For You
                    </Text>
                    <Text style={{ fontSize: "10px", color: c.muted2, margin: 0, fontFamily: font }}>
                      {quote.reference}
                    </Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

export default QuotationEmail;