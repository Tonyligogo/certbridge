import {
  Hr,
  Section,
  Text,
} from "react-email";

import { EmailLayout } from "./email-layout";
import { QuotationEmailProps } from "./quotation-email";

const TAX_RATE = 0.16;

const company = {
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

function deliveryLabel(mode: string): string {
  const map: Record<string, string> = {
    ONLINE:       "Online (Virtual)",
    ARRANGED_VENUE:    "At Our Venue",
    CLIENT_SITE: "At Client Venue",
  };
  return map[mode] ?? mode;
}

export function QuotationEmail2({
  quote,
  booking,
//   company,
}: QuotationEmailProps) {
  const clientName =
    booking.organizationName ??
    booking.contactName;

  const startDate =
    booking.scheduledStartDate ??
    booking.preferredStartDate;

  const endDate =
    booking.scheduledEndDate ??
    booking.preferredEndDate;

  const datesArePreferred =
    !booking.scheduledStartDate;

  const location = [
    booking.locationAddress,
    booking.locationCity,
    booking.locationCountry,
  ]
    .filter(Boolean)
    .join(", ");

  const subtotal =
    quote.items.reduce(
      (total, item) => {
        const amount =
          Number(item.amount);

        return total +
          (Number.isFinite(amount)
            ? amount
            : 0);
      },
      0
    );

  const taxAmount =
    subtotal * TAX_RATE;

  const totalAmount =
    subtotal + taxAmount;

  return (
    <EmailLayout
      preview={`Quotation ${quote.reference} — ${booking.course.title}`}
    >
      {/* Header */}
      <Section style={styles.header}>
        <table
          width="100%"
          cellPadding={0}
          cellSpacing={0}
        >
          <tbody>
            <tr>
              <td
                style={{
                  verticalAlign: "top",
                }}
              >
                <Text style={styles.brand}>
                  CertBridge
                  <span
                    style={
                      styles.brandSecondary
                    }
                  >
                    {" "}
                    Global
                  </span>
                </Text>
              </td>

              <td
                align="right"
                style={{
                  verticalAlign: "top",
                }}
              >
                <Text
                  style={
                    styles.documentTitle
                  }
                >
                  Quotation
                </Text>

                <Text
                  style={
                    styles.headerMeta
                  }
                >
                  Ref:{" "}
                  <strong>
                    {quote.reference}
                  </strong>

                  {quote.issuedAt && (
                    <>
                      <br />
                      Issued:{" "}
                      <strong>
                        {formatDate(
                          quote.issuedAt
                        )}
                      </strong>
                    </>
                  )}
                </Text>
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

      {/* Parties */}
      <Section style={styles.parties}>
        <table
          width="100%"
          cellPadding={0}
          cellSpacing={0}
        >
          <tbody>
            <tr>
              <td
                width="50%"
                style={
                  styles.partyColumn
                }
              >
                <Text
                  style={
                    styles.partyLabel
                  }
                >
                  BILLED TO:
                </Text>

                <Text
                  style={
                    styles.partyName
                  }
                >
                  {clientName}
                </Text>

                <InfoLine
                  label="Contact"
                  value={
                    booking.contactName
                  }
                />

                <InfoLine
                  label="Email"
                  value={
                    booking.contactEmail
                  }
                />

                <InfoLine
                  label="Phone"
                  value={
                    booking.contactPhone
                  }
                />

                {location && (
                  <InfoLine
                    label="Location"
                    value={location}
                  />
                )}
              </td>

              <td
                width="50%"
                style={{
                  ...styles.partyColumn,
                  paddingLeft: "28px",
                }}
              >
                <Text
                  style={
                    styles.partyLabel
                  }
                >
                  ISSUED BY:
                </Text>

                <Text
                  style={
                    styles.partyName
                  }
                >
                  {company.name}
                </Text>

                <InfoLine
                  label="Email"
                  value={
                    company.email
                  }
                />

                <InfoLine
                  label="Phone"
                  value={
                    company.phone
                  }
                />

                <InfoLine
                  label="Website"
                  value={
                    company.website
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

      {/* Validity */}
      <Section
        style={
          styles.validityNotice
        }
      >
        <Text
          style={{
            margin: 0,
            fontSize: "12px",
          }}
        >
          {quote.expiresAt ? (
            <>
              Valid until{" "}
              <strong>
                {formatDate(
                  quote.expiresAt
                )}
              </strong>
              {" — "}
              please confirm acceptance
              before this date to secure
              your preferred training
              dates.
            </>
          ) : (
            <>
              Please confirm acceptance
              at your earliest convenience
              to secure your preferred
              dates.
            </>
          )}
        </Text>
      </Section>

      <Section style={styles.body}>
        {/* Training overview */}

        <SectionTitle>
          Training Overview
        </SectionTitle>

        <Section
          style={
            styles.trainingCard
          }
        >
          <Text
            style={
              styles.courseTitle
            }
          >
            {booking.course.title}
          </Text>

          <Text
            style={
              styles.trainingMeta
            }
          >
            {formatDate(startDate)}
            {" — "}
            {formatDate(endDate)}
            {datesArePreferred
              ? " (preferred)"
              : ""}
          </Text>

          {location && (
            <Text
              style={
                styles.trainingMeta
              }
            >
              {location}
            </Text>
          )}

          <Text
            style={
              styles.trainingMeta
            }
          >
            {booking.participantCount}{" "}
            {booking.participantCount ===
            1
              ? "participant"
              : "participants"}
            {" · "}
            {/* {formatDeliveryMode(
              booking.deliveryMode
            )} */}
            {deliveryLabel(booking.deliveryMode)}
          </Text>

          <Text
            style={
              styles.bookingReference
            }
          >
            Booking{" "}
            {booking.reference}
          </Text>
        </Section>

        {/* Line items */}

        <SectionTitle>
          Line Items
        </SectionTitle>

        <table
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          style={
            styles.itemsTable
          }
        >
          <thead>
            <tr>
              <th
                align="left"
                style={
                  styles.tableHeader
                }
              >
                Description
              </th>

              <th
                align="center"
                style={
                  styles.tableHeader
                }
              >
                Qty
              </th>

              <th
                align="right"
                style={
                  styles.tableHeader
                }
              >
                Unit Price
              </th>

              <th
                align="right"
                style={
                  styles.tableHeader
                }
              >
                Amount
              </th>
            </tr>
          </thead>

          <tbody>
            {quote.items.map(
              (item) => (
                <tr key={item.id}>
                  <td
                    style={
                      styles.tableCell
                    }
                  >
                    <strong>
                      {item.name}
                    </strong>
                  </td>

                  <td
                    align="center"
                    style={
                      styles.tableCell
                    }
                  >
                    {Number(
                      item.quantity
                    )}
                  </td>

                  <td
                    align="right"
                    style={
                      styles.tableCell
                    }
                  >
                    {formatMoney(
                      item.unitPrice,
                      booking.currency
                    )}
                  </td>

                  <td
                    align="right"
                    style={
                      styles.tableCellStrong
                    }
                  >
                    {formatMoney(
                      item.amount,
                      booking.currency
                    )}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {/* Totals */}

        <table
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          style={{
            marginTop: "20px",
            marginBottom: "30px",
          }}
        >
          <tbody>
            <TotalRow
              label="Subtotal"
              value={formatMoney(
                String(subtotal),
                booking.currency
              )}
            />

            <TotalRow
              label="VAT (16%)"
              value={formatMoney(
                String(taxAmount),
                booking.currency
              )}
            />

            <tr>
              <td />

              <td
                width="300"
                style={
                  styles.totalBox
                }
              >
                <table
                  width="100%"
                  cellPadding={0}
                  cellSpacing={0}
                >
                  <tbody>
                    <tr>
                      <td
                        style={
                          styles.totalLabel
                        }
                      >
                        TOTAL DUE
                      </td>

                      <td
                        align="right"
                        style={
                          styles.totalValue
                        }
                      >
                        {formatMoney(
                          String(
                            totalAmount
                          ),
                          booking.currency
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Payment */}

        <Section
          style={
            styles.paymentBox
          }
        >
          <Text
            style={
              styles.paymentHeading
            }
          >
            PAYMENT INSTRUCTIONS
          </Text>

          <PaymentRow
            label="Bank"
            value={company.bankName}
          />

          <PaymentRow
            label="Account Name"
            value={
              company.accountName
            }
          />

          <PaymentRow
            label="Account No."
            value={
              company.accountNo
            }
          />

          <PaymentRow
            label="Branch"
            value={company.branch}
          />

          <PaymentRow
            label="M-Pesa Paybill"
            value={company.paybill}
          />

          <PaymentRow
            label="Account / Ref"
            value={
              quote.reference
            }
          />
        </Section>

        {/* Notes */}

        <Section
          style={styles.infoBox}
        >
          <Text
            style={
              styles.boxHeading
            }
          >
            NOTES
          </Text>

          <Text
            style={styles.noteText}
          >
            This quotation is prepared
            for <strong>{clientName}</strong>{" "}
            following their booking
            request for{" "}
            <strong>
              {booking.course.title}
            </strong>
            . Please use reference{" "}
            <strong>
              {quote.reference}
            </strong>{" "}
            in all payment
            communications.
          </Text>

          {booking.specialRequirements && (
            <Text
              style={
                styles.noteText
              }
            >
              <strong>
                Special requirements:
              </strong>{" "}
              {
                booking.specialRequirements
              }
            </Text>
          )}
        </Section>

        {/* Terms */}

        <Section
          style={styles.infoBox}
        >
          <Text
            style={
              styles.boxHeading
            }
          >
            TERMS & CONDITIONS
          </Text>

          <Text
            style={styles.term}>
            • Full payment required to
            confirm and secure the
            booking.
          </Text>

          <Text
            style={styles.term}
          >
            • Balance due 7 days before
            the training start date.
          </Text>

          <Text
            style={styles.term}
          >
            • Cancellations within 7 days
            of training forfeit the
            deposit.
          </Text>

          <Text
            style={styles.term}
          >
            • Rescheduling permitted with
            14 days&apos; notice at no
            charge.
          </Text>
        </Section>

        <Hr style={styles.footerRule} />

        <Text style={styles.footer}>
          {company.email} ·{" "}
          {company.phone} ·{" "}
          {company.website}
        </Text>
      </Section>
    </EmailLayout>
  );
}

function SectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <table
      width="100%"
      cellPadding={0}
      cellSpacing={0}
      style={{
        marginBottom: "14px",
      }}
    >
      <tbody>
        <tr>
          <td
            style={{
              width: "130px",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.8px",
              color: "#94a3b8",
              textTransform:
                "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            {children}
          </td>

          <td
            style={{
              borderTop:
                "1px solid #e2e8f0",
            }}
          />
        </tr>
      </tbody>
    </table>
  );
}

function InfoLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Text
      style={{
        fontSize: "12px",
        lineHeight: "18px",
        margin: "2px 0",
        color: "#334155",
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: "70px",
          color: "#94a3b8",
        }}
      >
        {label}
      </span>

      <strong>{value}</strong>
    </Text>
  );
}

function TotalRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <tr>
      <td />

      <td width="300">
        <table
          width="100%"
          cellPadding={0}
          cellSpacing={0}
        >
          <tbody>
            <tr>
              <td
                style={{
                  padding:
                    "4px 0",
                  fontSize:
                    "13px",
                  color:
                    "#64748b",
                }}
              >
                {label}
              </td>

              <td
                align="right"
                style={{
                  padding:
                    "4px 0",
                  fontSize:
                    "13px",
                  fontWeight:
                    600,
                  color:
                    "#334155",
                }}
              >
                {value}
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
}

function PaymentRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <table
      width="100%"
      cellPadding={0}
      cellSpacing={0}
    >
      <tbody>
        <tr>
          <td
            style={{
              padding: "8px 0",
              borderBottom:
                "1px solid #f1f5f9",
              fontSize: "12px",
              color: "#64748b",
            }}
          >
            {label}
          </td>

          <td
            align="right"
            style={{
              padding: "8px 0",
              borderBottom:
                "1px solid #f1f5f9",
              fontSize: "13px",
              fontWeight: 600,
              color: "#0f172a",
            }}
          >
            {value}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function formatDate(
  value:
    | Date
    | string
    | null
    | undefined
) {
  if (!value) return "—";

  return new Intl.DateTimeFormat(
    "en-KE",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(new Date(value));
}

function formatMoney(
  value: string | number,
  currency = "KES"
) {
  const amount =
    Number(value);

  if (!Number.isFinite(amount)) {
    return "—";
  }

  return `${currency} ${new Intl.NumberFormat(
    "en-KE",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }
  ).format(amount)}`;
}

function formatDeliveryMode(
  mode:
    | "ONLINE"
    | "CLIENT_SITE"
    | "ARRANGED_VENUE"
) {
  switch (mode) {
    case "ONLINE":
      return "Online";

    case "CLIENT_SITE":
      return "Client Venue";

    case "ARRANGED_VENUE":
      return "Arranged Venue";
  }
}

const styles = {
  header: {
    backgroundColor: "#0f172a",
    padding: "28px 32px",
  },

  brand: {
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: 700,
    margin: 0,
  },

  brandSecondary: {
    color: "#cbd5e1",
    fontSize: "16px",
    fontWeight: 500,
  },

  documentTitle: {
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: 800,
    lineHeight: "32px",
    margin: 0,
  },

  headerMeta: {
    color: "#ffffff",
    fontSize: "12px",
    lineHeight: "18px",
    margin: "8px 0 0",
  },

  parties: {
    padding: "24px 32px",
  },

  partyColumn: {
    verticalAlign: "top",
  },

  partyLabel: {
    color: "#2563eb",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1px",
    margin: "0 0 10px",
  },

  partyName: {
    color: "#0f172a",
    fontSize: "14px",
    fontWeight: 700,
    margin: "0 0 8px",
  },

  validityNotice: {
    backgroundColor: "#f8fafc",
    borderTop:
      "1px solid #f1f5f9",
    borderBottom:
      "1px solid #f1f5f9",
    padding: "10px 32px",
    color: "#334155",
  },

  body: {
    padding: "30px 32px",
  },

  trainingCard: {
    backgroundColor: "#f8fafc",
    border: "1px solid #dbeafe",
    borderLeft:
      "4px solid #2563eb",
    padding: "18px",
    marginBottom: "28px",
  },

  courseTitle: {
    color: "#0f172a",
    fontSize: "16px",
    fontWeight: 700,
    margin: "0 0 8px",
  },

  trainingMeta: {
    color: "#64748b",
    fontSize: "12px",
    lineHeight: "18px",
    margin: "2px 0",
  },

  bookingReference: {
    color: "#94a3b8",
    fontSize: "11px",
    margin: "8px 0 0",
  },

  itemsTable: {
    borderCollapse:
      "collapse" as const,
    marginBottom: "4px",
  },

  tableHeader: {
    borderBottom:
      "2px solid #0f172a",
    padding: "0 8px 10px",
    fontSize: "10px",
    color: "#94a3b8",
    textTransform:
      "uppercase" as const,
  },

  tableCell: {
    borderBottom:
      "1px solid #e2e8f0",
    padding: "13px 8px",
    fontSize: "13px",
    color: "#475569",
  },

  tableCellStrong: {
    borderBottom:
      "1px solid #e2e8f0",
    padding: "13px 8px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#0f172a",
  },

  totalBox: {
    backgroundColor: "#0f172a",
    padding: "12px 16px",
  },

  totalLabel: {
    color: "#cbd5e1",
    fontSize: "11px",
    fontWeight: 700,
  },

  totalValue: {
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: 800,
  },

  paymentBox: {
    border: "1px solid #e2e8f0",
    padding: "20px",
    marginBottom: "24px",
  },

  paymentHeading: {
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "1px",
    color: "#0f172a",
    margin: "0 0 10px",
  },

  infoBox: {
    border: "1px solid #e2e8f0",
    padding: "18px",
    marginBottom: "20px",
  },

  boxHeading: {
    color: "#94a3b8",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "1px",
    margin: "0 0 10px",
  },

  noteText: {
    color: "#475569",
    fontSize: "12px",
    lineHeight: "19px",
    margin: "0 0 8px",
  },

  term: {
    color: "#475569",
    fontSize: "12px",
    lineHeight: "18px",
    margin: "4px 0",
  },

  footerRule: {
    borderColor: "#e2e8f0",
    margin: "26px 0 16px",
  },

  footer: {
    color: "#64748b",
    fontSize: "11px",
    textAlign: "center" as const,
    margin: 0,
  },
};