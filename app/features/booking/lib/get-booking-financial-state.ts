import { InvoiceStatus, PaymentStatus } from "@/generated/prisma/enums";

export type BookingFinancialState =
  | "NOT_STARTED"
  | "DRAFT"
  | "INVOICED"
  | "PARTIALLY_PAID"
  | "PAID"
  | "OVERDUE";

export interface BookingFinancialInvoice {
  id: string;
  reference: string;

  status:InvoiceStatus;

  currency: string;

  totalAmount: string;

  issuedAt: string | null;
  dueAt: string | null;

  payments: Array<{
    amount: string;

    status:PaymentStatus
  }>;
}

export interface InvoiceFinancialSummary {
  id: string;
  reference: string;
  status: BookingFinancialInvoice["status"];
  currency: string;

  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;

  isDraft: boolean;
  isIssued: boolean;
  isPaid: boolean;
  isVoid: boolean;

  isPartiallyPaid: boolean;
  isOverdue: boolean;

  dueAt: string | null;
}

export interface BookingFinancialSummary {
  state: BookingFinancialState;

  currency: string | null;

  totalInvoiced: number;
  totalPaid: number;
  totalOutstanding: number;

  invoiceCount: number;
  activeInvoiceCount: number;

  draftInvoiceCount: number;
  issuedInvoiceCount: number;
  paidInvoiceCount: number;
  overdueInvoiceCount: number;

  hasInvoices: boolean;
  hasDraftInvoices: boolean;
  hasIssuedInvoices: boolean;
  hasPayments: boolean;
  hasOutstandingBalance: boolean;
  hasOverdueInvoices: boolean;

  invoices: InvoiceFinancialSummary[];
}

function getCompletedPaymentTotal(
  invoice: BookingFinancialInvoice
): number {
  return invoice.payments
    .filter(
      (payment) =>
        payment.status === "COMPLETED"
    )
    .reduce(
      (total, payment) =>
        total + Number(payment.amount),
      0
    );
}

export function getInvoiceFinancialSummary(
  invoice: BookingFinancialInvoice,
  now = new Date()
): InvoiceFinancialSummary {
  const totalAmount = Number(invoice.totalAmount);

  const paidAmount = getCompletedPaymentTotal(invoice);

  const outstandingAmount = invoice.status === "VOID" ? 0
      : Math.max(
          totalAmount - paidAmount,
          0
        );

  const isDraft = invoice.status === "DRAFT";

  const isIssued = invoice.status === "ISSUED";

  const isPaid = invoice.status === "PAID";

  const isVoid = invoice.status === "VOID";

  const isPartiallyPaid = !isVoid &&
    paidAmount > 0 &&
    outstandingAmount > 0;

  const isOverdue = isIssued &&
    outstandingAmount > 0 &&
    invoice.dueAt !== null &&
    new Date(invoice.dueAt) < now;

  return {
    id: invoice.id,
    reference: invoice.reference,
    status: invoice.status,
    currency: invoice.currency,

    totalAmount,
    paidAmount,
    outstandingAmount,

    isDraft,
    isIssued,
    isPaid,
    isVoid,

    isPartiallyPaid,
    isOverdue,

    dueAt: invoice.dueAt,
  };
}

interface DeriveFinancialStateInput {
  activeInvoices:
    InvoiceFinancialSummary[];

  totalPaid: number;
  totalOutstanding: number;

  hasOverdueInvoices: boolean;
}

function deriveBookingFinancialState({
  activeInvoices,
  totalPaid,
  totalOutstanding,
  hasOverdueInvoices,
}: DeriveFinancialStateInput): BookingFinancialState {
  /*
   * No active invoices.
   *
   * Void invoices do not count.
   */
  if (activeInvoices.length === 0) {
    return "NOT_STARTED";
  }

  /*
   * Overdue takes priority over normal
   * unpaid / partially-paid states.
   */
  if (hasOverdueInvoices) {
    return "OVERDUE";
  }

  const issuedOrPaid =
    activeInvoices.filter(
      (invoice) =>
        invoice.status === "ISSUED" ||
        invoice.status === "PAID"
    );

  /*
   * We only have drafts.
   */
  if (issuedOrPaid.length === 0) {
    return "DRAFT";
  }

  /*
   * Every non-void invoice has been paid
   * and there is no outstanding balance.
   */
  const allPaid =
    activeInvoices.every(
      (invoice) => invoice.isPaid
    );

  if (
    allPaid &&
    totalOutstanding === 0
  ) {
    return "PAID";
  }

  /*
   * At least some money has been received
   * but money remains outstanding.
   */
  if (
    totalPaid > 0 &&
    totalOutstanding > 0
  ) {
    return "PARTIALLY_PAID";
  }

  return "INVOICED";
}

export function getBookingFinancialSummary(
  invoices: BookingFinancialInvoice[],
  now = new Date()
): BookingFinancialSummary {
  const invoiceSummaries =
    invoices.map((invoice) =>
      getInvoiceFinancialSummary(
        invoice,
        now
      )
    );

  /*
   * VOID invoices remain available in the
   * invoice summaries/history but do not
   * contribute to booking financial totals.
   */
  const activeInvoices =
    invoiceSummaries.filter(
      (invoice) => !invoice.isVoid
    );

  /*
   * DRAFT invoices are not yet amounts we
   * have actually billed to the client.
   *
   * Therefore totalInvoiced only includes
   * ISSUED / PAID invoices.
   */
  const billableInvoices =
    activeInvoices.filter(
      (invoice) =>
        invoice.status === "ISSUED" ||
        invoice.status === "PAID"
    );

  const totalInvoiced =
    billableInvoices.reduce(
      (total, invoice) =>
        total + invoice.totalAmount,
      0
    );

  const totalPaid =
    activeInvoices.reduce(
      (total, invoice) =>
        total + invoice.paidAmount,
      0
    );

  const totalOutstanding =
    billableInvoices.reduce(
      (total, invoice) =>
        total +
        invoice.outstandingAmount,
      0
    );

  const draftInvoiceCount =
    activeInvoices.filter(
      (invoice) => invoice.isDraft
    ).length;

  const issuedInvoiceCount =
    activeInvoices.filter(
      (invoice) => invoice.isIssued
    ).length;

  const paidInvoiceCount =
    activeInvoices.filter(
      (invoice) => invoice.isPaid
    ).length;

  const overdueInvoiceCount =
    activeInvoices.filter(
      (invoice) => invoice.isOverdue
    ).length;

  const hasInvoices =
    activeInvoices.length > 0;

  const hasDraftInvoices =
    draftInvoiceCount > 0;

  const hasIssuedInvoices =
    issuedInvoiceCount > 0;

  const hasPayments =
    totalPaid > 0;

  const hasOutstandingBalance =
    totalOutstanding > 0;

  const hasOverdueInvoices =
    overdueInvoiceCount > 0;

  const state =
    deriveBookingFinancialState({
      activeInvoices,
      totalPaid,
      totalOutstanding,
      hasOverdueInvoices,
    });

  /*
   * Currently our booking is effectively
   * single-currency. Return the active
   * invoice currency for display.
   */
  const currency =
    activeInvoices[0]?.currency ??
    null;

  return {
    state,

    currency,

    totalInvoiced,
    totalPaid,
    totalOutstanding,

    invoiceCount:
      invoices.length,

    activeInvoiceCount:
      activeInvoices.length,

    draftInvoiceCount,
    issuedInvoiceCount,
    paidInvoiceCount,
    overdueInvoiceCount,

    hasInvoices,
    hasDraftInvoices,
    hasIssuedInvoices,
    hasPayments,
    hasOutstandingBalance,
    hasOverdueInvoices,

    invoices:
      invoiceSummaries,
  };
}