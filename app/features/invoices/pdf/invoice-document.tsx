
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

import type {
  InvoicePdfData,
  InvoiceCompanyDetails,
} from "./invoice-pdf-data";

const colors = {
  ink: "#142033",
  muted: "#64748B",
  border: "#E2E8F0",
  surface: "#F8FAFC",
  accent: "#2563EB",
  white: "#FFFFFF",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: colors.ink,
    backgroundColor: colors.white,
    paddingTop: 42,
    paddingHorizontal: 42,
    paddingBottom: 64,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
  },

  company: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "60%",
  },

  logo: {
    width: 46,
    height: 46,
    objectFit: "contain",
    marginRight: 12,
  },

  companyName: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },

  muted: {
    color: colors.muted,
  },

  small: {
    fontSize: 8,
    lineHeight: 1.5,
  },

  invoiceTitle: {
    fontSize: 25,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.2,
    textAlign: "right",
  },

  invoiceReference: {
    fontSize: 10,
    color: colors.muted,
    textAlign: "right",
    marginTop: 6,
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    marginBottom: 30,
  },

  infoColumn: {
    width: "48%",
  },

  sectionLabel: {
    fontSize: 8,
    color: colors.muted,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.8,
    marginBottom: 10,
  },

  clientName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
  },

  infoText: {
    fontSize: 9,
    lineHeight: 1.7,
    color: colors.muted,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  detailLabel: {
    color: colors.muted,
  },

  detailValue: {
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },

  courseBox: {
    backgroundColor: colors.surface,
    borderRadius: 5,
    padding: 14,
    marginBottom: 24,
  },

  courseLabel: {
    fontSize: 8,
    color: colors.muted,
    marginBottom: 5,
  },

  courseTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.ink,
    paddingVertical: 11,
    paddingHorizontal: 12,
  },

  tableHeaderText: {
    color: colors.white,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },

  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  descriptionColumn: {
    width: "46%",
    paddingRight: 10,
  },

  quantityColumn: {
    width: "12%",
    textAlign: "center",
  },

  priceColumn: {
    width: "21%",
    textAlign: "right",
  },

  amountColumn: {
    width: "21%",
    textAlign: "right",
  },

  itemName: {
    fontSize: 9,
    lineHeight: 1.5,
  },

  totalsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 22,
  },

  totals: {
    width: "48%",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  totalLabel: {
    color: colors.muted,
  },

  totalValue: {
    fontFamily: "Helvetica-Bold",
  },

  grandTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.ink,
    marginTop: 3,
  },

  grandTotalLabel: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },

  grandTotalValue: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: colors.accent,
  },

  notesSection: {
    marginTop: 28,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  notesTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
  },

  notesText: {
    color: colors.muted,
    lineHeight: 1.6,
  },

  paymentBox: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 5,
    marginTop: 20,
  },

  footer: {
    position: "absolute",
    bottom: 25,
    left: 42,
    right: 42,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  footerText: {
    fontSize: 8,
    color: colors.muted,
  },

  watermark: {
    position: "absolute",
    top: "43%",
    left: "22%",
    fontSize: 74,
    color: "#E2E8F0",
    opacity: 0.35,
    transform: "rotate(-30deg)",
  },
});

interface InvoiceDocumentProps {
  invoice: InvoicePdfData;
  company: InvoiceCompanyDetails;
  documentType:string;
}

function formatMoney(value: string, currency: string) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return value;
  }

  return `${currency} ${number.toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: string | null) {
  if (!value) return "Not set";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

// works for both quotes and invoices
export function InvoiceDocument({
  invoice,
  company,
  documentType
}: InvoiceDocumentProps) {

  return (
    <Document
      title={`${documentType} ${invoice.reference}`}
      author={company.name}
      subject={`${documentType} for ${invoice.bookingReference}`}
    >
      <Page size="A4" style={styles.page} wrap>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.company}>
            {company.logoUrl ? (
              <Image
                src={company.logoUrl}
                style={styles.logo}
              />
            ) : null}

            <View>
              <Text style={styles.companyName}>
                {company.name}
              </Text>

              {company.tagline && (
                <Text style={[styles.muted, styles.small]}>
                  {company.tagline}
                </Text>
              )}
            </View>
          </View>

          <View>
            <Text style={styles.invoiceTitle}>
              {documentType}
            </Text>

            <Text style={styles.invoiceReference}>
              {invoice.reference}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Client and invoice information */}
        <View style={styles.infoSection}>
          <View style={styles.infoColumn}>
            <Text style={styles.sectionLabel}>
              BILL TO
            </Text>

            <Text style={styles.clientName}>
              {invoice.client.organizationName ||
                invoice.client.contactName}
            </Text>

            {invoice.client.organizationName && (
              <Text style={styles.infoText}>
                Attn: {invoice.client.contactName}
              </Text>
            )}

            <Text style={styles.infoText}>
              {invoice.client.email}
            </Text>

            {invoice.client.phone && (
              <Text style={styles.infoText}>
                {invoice.client.phone}
              </Text>
            )}
          </View>

          <View style={styles.infoColumn}>
            <Text style={styles.sectionLabel}>
              {documentType} Details
            </Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {documentType} date
              </Text>
              <Text style={styles.detailValue}>
                {formatDate(invoice.issuedAt)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                Due date
              </Text>
              <Text style={styles.detailValue}>
                {formatDate(invoice.dueAt)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                Booking
              </Text>
              <Text style={styles.detailValue}>
                {invoice.bookingReference}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                Currency
              </Text>
              <Text style={styles.detailValue}>
                {invoice.currency}
              </Text>
            </View>
          </View>
        </View>

        {/* Course */}
        <View style={styles.courseBox} wrap={false}>
          <Text style={styles.courseLabel}>
            TRAINING PROGRAMME
          </Text>

          <Text style={styles.courseTitle}>
            {invoice.courseTitle}
          </Text>
        </View>

        {/* Invoice items */}
        <View style={styles.tableHeader} fixed={false}>
          <Text
            style={[
              styles.tableHeaderText,
              styles.descriptionColumn,
            ]}
          >
            DESCRIPTION
          </Text>

          <Text
            style={[
              styles.tableHeaderText,
              styles.quantityColumn,
            ]}
          >
            QTY
          </Text>

          <Text
            style={[
              styles.tableHeaderText,
              styles.priceColumn,
            ]}
          >
            UNIT PRICE
          </Text>

          <Text
            style={[
              styles.tableHeaderText,
              styles.amountColumn,
            ]}
          >
            AMOUNT
          </Text>
        </View>

        {invoice.items.map((item, index) => (
          <View
            key={index}
            style={styles.tableRow}
            wrap={false}
          >
            <Text
              style={[
                styles.itemName,
                styles.descriptionColumn,
              ]}
            >
              {item.name}
            </Text>

            <Text style={styles.quantityColumn}>
              {item.quantity}
            </Text>

            <Text style={styles.priceColumn}>
              {formatMoney(
                item.unitPrice,
                invoice.currency
              )}
            </Text>

            <Text style={styles.amountColumn}>
              {formatMoney(
                item.amount,
                invoice.currency
              )}
            </Text>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totalsContainer} wrap={false}>
          <View style={styles.totals}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Subtotal
              </Text>

              <Text style={styles.totalValue}>
                {formatMoney(
                  invoice.subtotal,
                  invoice.currency
                )}
              </Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Tax ({invoice.taxType}, {invoice.taxRate}%)
              </Text>

              <Text style={styles.totalValue}>
                {formatMoney(
                  invoice.taxAmount,
                  invoice.currency
                )}
              </Text>
            </View>

            <View style={styles.grandTotal}>
              <Text style={styles.grandTotalLabel}>
                Total Due
              </Text>

              <Text style={styles.grandTotalValue}>
                {formatMoney(
                  invoice.totalAmount,
                  invoice.currency
                )}
              </Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notesSection} wrap={false}>
            <Text style={styles.notesTitle}>
              {documentType} Notes
            </Text>

            <Text style={styles.notesText}>
              {invoice.notes}
            </Text>
          </View>
        )}

        {/* Payment instructions */}
        {company.paymentInstructions && (
          <View style={styles.paymentBox} wrap={false}>
            <Text style={styles.notesTitle}>
              Payment Instructions
            </Text>

            <Text style={styles.notesText}>
              {company.paymentInstructions}
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <View>
            <Text style={styles.footerText}>
              {company.name}
            </Text>

            <Text style={styles.footerText}>
              {[company.email, company.phone]
                .filter(Boolean)
                .join(" | ")}
            </Text>

            {company.taxPin && (
              <Text style={styles.footerText}>
                Tax PIN: {company.taxPin}
              </Text>
            )}
          </View>

          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
