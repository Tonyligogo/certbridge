"use client";

import {
  Banknote,
  Check,
  Clock3,
  FileText,
  LucideIcon,
  Plus,
  ReceiptText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type {
  QuoteStatus,
} from "@/generated/prisma/enums";

import { Badge } from "@/components/ui/badge";
import { BookingWorkflow } from "../../types";
import { AdminBookingDetailsResponse } from "../../types/admin-booking";


interface CommercialCardProps {
  booking: AdminBookingDetailsResponse;
  workflow: BookingWorkflow;

  onCreateQuote?: () => void;
  onViewQuote?: () => void;

  onCreateInvoice?: () => void;
  onViewInvoice?: (
    invoiceId: string
  ) => void;

  onRecordPayment?: (
    invoiceId: string
  ) => void;
}

const quoteStatusConfig: Record<
  QuoteStatus,
  {
    label: string;
    className: string;
  }
> = {
  DRAFT: {
    label: "Draft",
    className:
      "border-slate-200 bg-slate-50 text-slate-700",
  },

  SENT: {
    label: "Sent",
    className:
      "border-blue-200 bg-blue-50 text-blue-700",
  },

  ACCEPTED: {
    label: "Accepted",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
  },

  DECLINED: {
    label: "Declined",
    className:
      "border-rose-200 bg-rose-50 text-rose-700",
  },

  EXPIRED: {
    label: "Expired",
    className:
      "border-amber-200 bg-amber-50 text-amber-700",
  },

  CANCELLED: {
    label: "Cancelled",
    className:
      "border-slate-200 bg-slate-100 text-slate-500",
  },
};

function QuoteStatusBadge({
  status,
}: {
  status: QuoteStatus;
}) {
  const config =
    quoteStatusConfig[status];

  return (
    <Badge
      variant="outline"
      className={config.className}
    >
      {config.label}
    </Badge>
  );
}

export function CommercialCard({
  booking,
  workflow,

  onCreateQuote,
  onViewQuote,

  onCreateInvoice,
  onViewInvoice,
  onRecordPayment,
}: CommercialCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">
          Commercial
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <QuoteSection
          booking={booking}
          workflow={workflow}
          onCreateQuote={onCreateQuote}
          onViewQuote={onViewQuote}
        />

        <div className="border-t" />

        <FinanceSection
          booking={booking}
          workflow={workflow}
          onCreateInvoice={
            onCreateInvoice
          }
          onViewInvoice={
            onViewInvoice
          }
          onRecordPayment={
            onRecordPayment
          }
        />
      </CardContent>
    </Card>
  );
}

function QuoteSection({
  booking,
  workflow,
  onCreateQuote,
  onViewQuote,
}: {
  booking: AdminBookingDetailsResponse;
  workflow: BookingWorkflow;

  onCreateQuote?: () => void;
  onViewQuote?: () => void;
}) {
  const quote = booking.quote;

  if (!quote) {
    const canCreate =
      workflow.actions.some(
        ({ type }) =>
          type === "CREATE_QUOTE"
      );

    return (
      <CommercialSection
        icon={FileText}
        title="Quote"
        status="Not created"
      >
        <div className="rounded-lg border border-dashed p-4">
          <p className="text-sm text-muted-foreground">
            No quote has been prepared
            for this booking yet.
          </p>

          {canCreate && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={onCreateQuote}
            >
              <Plus className="mr-2 size-4" />
              Prepare quote
            </Button>
          )}
        </div>
      </CommercialSection>
    );
  }

  const total =
    getQuoteTotal(quote);

  return (
    <CommercialSection
      icon={FileText}
      title="Quote"
      status={
        <QuoteStatusBadge
          status={quote.status}
        />
      }
    >
      <button
        type="button"
        className="w-full rounded-lg border p-4 text-left transition-colors hover:bg-muted/40"
        onClick={onViewQuote}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium">
              {quote.reference}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {getQuoteDateDescription(
                quote
              )}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-sm font-semibold">
              {formatMoney(
                total,
                booking.currency
              )}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {quote.items.length}{" "}
              {quote.items.length === 1
                ? "item"
                : "items"}
            </p>
          </div>
        </div>
      </button>

      {quote.status === "ACCEPTED" && (
        <div className="mt-3 flex items-center gap-2 text-xs text-emerald-700">
          <Check className="size-3.5" />

          <span>
            Commercial terms accepted
          </span>
        </div>
      )}
    </CommercialSection>
  );
}

type Quote =
  NonNullable<
    AdminBookingDetailsResponse["quote"]
  >;

function getQuoteTotal(
  quote: Quote
) {
  return quote.items.reduce(
    (total, item) =>
      total + Number(item.amount),
    0
  );
}

function getQuoteDateDescription(
  quote: Quote
) {
  if (
    quote.status === "ACCEPTED" &&
    quote.acceptedAt
  ) {
    return `Accepted ${formatShortDate(
      quote.acceptedAt
    )}`;
  }

  if (
    quote.status === "DECLINED" &&
    quote.declinedAt
  ) {
    return `Declined ${formatShortDate(
      quote.declinedAt
    )}`;
  }

  if (quote.issuedAt) {
    return `Issued ${formatShortDate(
      quote.issuedAt
    )}`;
  }

  return "Not yet issued";
}

function FinanceSection({
  booking,
  workflow,
  onCreateInvoice,
  onViewInvoice,
  onRecordPayment,
}: {
  booking: AdminBookingDetailsResponse;
  workflow: BookingWorkflow;

  onCreateInvoice?: () => void;

  onViewInvoice?: (
    invoiceId: string
  ) => void;

  onRecordPayment?: (
    invoiceId: string
  ) => void;
}) {
  const invoices =
    booking.invoices;

  const canCreateInvoice =
    workflow.actions.some(
      ({ type }) =>
        type === "CREATE_INVOICE"
    );

  if (invoices.length === 0) {
    return (
      <CommercialSection
        icon={ReceiptText}
        title="Finance"
        status="No invoices"
      >
        <div className="rounded-lg border border-dashed p-4">
          <p className="text-sm text-muted-foreground">
            {booking.quote?.status ===
            "ACCEPTED"
              ? "No invoice has been created for this booking yet."
              : "Invoicing becomes available after the quote has been accepted."}
          </p>

          {canCreateInvoice && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={
                onCreateInvoice
              }
            >
              <Plus className="mr-2 size-4" />
              Create invoice
            </Button>
          )}
        </div>
      </CommercialSection>
    );
  }

  const summary =
    getFinanceSummary(invoices);

  return (
    <CommercialSection
      icon={ReceiptText}
      title="Finance"
      status={
        <FinanceStatus
          summary={summary}
        />
      }
    >
      <FinanceSummary
        summary={summary}
        currency={booking.currency}
      />

      <div className="mt-4 divide-y rounded-lg border">
        {invoices.map(
          (invoice) => (
            <InvoiceRow
              key={invoice.id}
              invoice={invoice}
              onView={() =>
                onViewInvoice?.(
                  invoice.id
                )
              }
              onRecordPayment={() =>
                onRecordPayment?.(
                  invoice.id
                )
              }
            />
          )
        )}
      </div>
    </CommercialSection>
  );
}

type Invoice =
  AdminBookingDetailsResponse["invoices"][number];

function getFinanceSummary(
  invoices: Invoice[]
) {
  const active =
    invoices.filter(
      ({ status }) =>
        status !== "VOID"
    );

  const invoiced =
    active.reduce(
      (total, invoice) =>
        total +
        Number(invoice.totalAmount),
      0
    );

  const paid =
    active.reduce(
      (total, invoice) => {
        const invoicePaid =
          invoice.payments
            .filter(
              ({ status }) =>
                status ===
                "COMPLETED"
            )
            .reduce(
              (sum, payment) =>
                sum +
                Number(
                  payment.amount
                ),
              0
            );

        return total + invoicePaid;
      },
      0
    );

  return {
    invoiced,
    paid,
    balance: Math.max(
      invoiced - paid,
      0
    ),
  };
}

function FinanceSummary({
  summary,
  currency,
}: {
  summary: ReturnType<
    typeof getFinanceSummary
  >;
  currency: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-3 rounded-lg bg-muted/40 p-4">
      <MoneyMetric
        label="Invoiced"
        value={formatMoney(
          summary.invoiced,
          currency
        )}
      />

      <MoneyMetric
        label="Paid"
        value={formatMoney(
          summary.paid,
          currency
        )}
      />

      <MoneyMetric
        label="Balance"
        value={formatMoney(
          summary.balance,
          currency
        )}
        emphasized={
          summary.balance > 0
        }
      />
    </div>
  );
}

function MoneyMetric({
  label,
  value,
  emphasized = false,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p
        className={[
          "mt-1 truncate text-sm font-semibold",
          emphasized
            ? "text-foreground"
            : "",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

function InvoiceRow({
  invoice,
  onView,
  onRecordPayment,
}: {
  invoice: Invoice;
  onView?: () => void;
  onRecordPayment?: () => void;
}) {
  const payment =
    getInvoiceSummary(invoice);

  return (
    <div className="p-4">
      <button
        type="button"
        className="w-full text-left"
        onClick={onView}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium">
                {invoice.reference}
              </p>

              <InvoiceStatusBadge
                invoice={invoice}
                payment={payment}
              />
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              {getInvoiceDateLabel(
                invoice
              )}
            </p>
          </div>

          <p className="shrink-0 text-sm font-semibold">
            {formatMoney(
              Number(
                invoice.totalAmount
              ),
              invoice.currency
            )}
          </p>
        </div>

        {invoice.status !== "VOID" &&
          invoice.status !== "DRAFT" && (
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>
                Paid{" "}
                {formatMoney(
                  payment.paid,
                  invoice.currency
                )}
              </span>

              <span>
                Balance{" "}
                {formatMoney(
                  payment.balance,
                  invoice.currency
                )}
              </span>
            </div>
          )}
      </button>

      {payment.balance > 0 &&
        invoice.status ===
          "ISSUED" && (
          <Button
            type="button"
            variant="link"
            size="sm"
            className="mt-2 h-auto px-0 py-0 text-xs"
            onClick={
              onRecordPayment
            }
          >
            <Banknote className="mr-1.5 size-3.5" />
            Record payment
          </Button>
        )}
    </div>
  );
}

function getInvoiceSummary(
  invoice: Invoice
) {
  const total =
    Number(invoice.totalAmount);

  const paid =
    invoice.payments
      .filter(
        ({ status }) =>
          status === "COMPLETED"
      )
      .reduce(
        (sum, payment) =>
          sum +
          Number(payment.amount),
        0
      );

  return {
    total,
    paid,
    balance: Math.max(
      total - paid,
      0
    ),
  };
}

function InvoiceStatusBadge({
  invoice,
  payment,
}: {
  invoice: Invoice;
  payment: ReturnType<
    typeof getInvoiceSummary
  >;
}) {
  const status =
    getDisplayInvoiceStatus(
      invoice,
      payment
    );

  const config = {
    DRAFT: {
      label: "Draft",
      className:
        "border-slate-200 bg-slate-50 text-slate-700",
    },

    ISSUED: {
      label: "Issued",
      className:
        "border-blue-200 bg-blue-50 text-blue-700",
    },

    PARTIALLY_PAID: {
      label: "Partially paid",
      className:
        "border-amber-200 bg-amber-50 text-amber-700",
    },

    OVERDUE: {
      label: "Overdue",
      className:
        "border-rose-200 bg-rose-50 text-rose-700",
    },

    PAID: {
      label: "Paid",
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-700",
    },

    VOID: {
      label: "Void",
      className:
        "border-slate-200 bg-slate-100 text-slate-500",
    },
  }[status];

  return (
    <Badge
      variant="outline"
      className={config.className}
    >
      {config.label}
    </Badge>
  );
}

type DisplayInvoiceStatus =
  | "DRAFT"
  | "ISSUED"
  | "PARTIALLY_PAID"
  | "OVERDUE"
  | "PAID"
  | "VOID";

function getDisplayInvoiceStatus(
  invoice: Invoice,
  payment: ReturnType<
    typeof getInvoiceSummary
  >
): DisplayInvoiceStatus {
  if (invoice.status === "VOID") {
    return "VOID";
  }

  if (payment.balance <= 0) {
    return "PAID";
  }

  if (invoice.status === "DRAFT") {
    return "DRAFT";
  }

  if (
    invoice.dueAt &&
    new Date(invoice.dueAt) <
      new Date()
  ) {
    return "OVERDUE";
  }

  if (payment.paid > 0) {
    return "PARTIALLY_PAID";
  }

  return "ISSUED";
}

function getInvoiceDateLabel(
  invoice: Invoice
) {
  if (invoice.status === "DRAFT") {
    return "Draft invoice";
  }

  if (invoice.dueAt) {
    return `Due ${formatShortDate(
      invoice.dueAt
    )}`;
  }

  if (invoice.issuedAt) {
    return `Issued ${formatShortDate(
      invoice.issuedAt
    )}`;
  }

  return "No due date";
}

export function formatShortDate(
  value: string
) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }
  ).format(new Date(value));
}

function FinanceStatus({
  summary,
}: {
  summary: ReturnType<
    typeof getFinanceSummary
  >;
}) {
  if (summary.balance <= 0) {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-emerald-700">
        <Check className="size-3" />
        Paid
      </span>
    );
  }

  if (summary.paid > 0) {
    return (
      <span className="text-xs font-medium text-amber-700">
        Partially paid
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      <Clock3 className="size-3" />
      Outstanding
    </span>
  );
}

function CommercialSection({
  icon: Icon,
  title,
  status,
  children,
}: {
  icon: LucideIcon;
  title: string;
  status?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-muted-foreground" />

          <h3 className="text-sm font-medium">
            {title}
          </h3>
        </div>

        {status && (
          <div className="shrink-0">
            {status}
          </div>
        )}
      </div>

      {children}
    </section>
  );
}

export function formatMoney(
  amount: number,
  currency: string
) {
  return new Intl.NumberFormat(
    "en-KE",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }
  ).format(amount);
}