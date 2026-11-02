"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  ChevronRight,
  FileText,
  Plus,
  ReceiptText,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { getBookingFinancialSummary, getInvoiceFinancialSummary } from "../../lib/get-booking-financial-state";
import type{ BookingFinancialState } from "../../lib/get-booking-financial-state";
import { formatDate, formatMoney } from "../../utils/utils";
import type { Invoice } from "@/app/features/invoices/types/invoice";
import { RecordPaymentForm } from "@/app/features/payments/components/record-payment-form";
import { AdminBookingDetailsResponse } from "../../types/admin-booking";
import BookingInvoice from "./BookingInvoice";

interface FinanceSummaryProps {
  financial: ReturnType<
    typeof getBookingFinancialSummary
  >;

  fallbackCurrency: string;
}

function FinanceSummary({
  financial,
  fallbackCurrency,
}: FinanceSummaryProps) {
  const currency =
    financial.currency ??
    fallbackCurrency;

  const config =
    financeStateConfig[
      financial.state
    ];

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold">
            Financial summary
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Billing and payment position
            for this booking.
          </p>
        </div>

        <Badge
          variant="secondary"
          className={cn(
            "border-0",
            config.className
          )}
        >
          {config.label}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <SummaryAmount
          label="Invoiced"
          amount={
            financial.totalInvoiced
          }
          currency={currency}
        />

        <SummaryAmount
          label="Paid"
          amount={
            financial.totalPaid
          }
          currency={currency}
        />

        <SummaryAmount
          label="Outstanding"
          amount={
            financial.totalOutstanding
          }
          currency={currency}
          emphasize={
            financial.totalOutstanding >
            0
          }
        />
      </div>

      {financial.hasOverdueInvoices && (
        <div className="flex items-start gap-2 rounded-lg bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />

          <span>
            {
              financial.overdueInvoiceCount
            }{" "}
            overdue{" "}
            {financial.overdueInvoiceCount ===
            1
              ? "invoice"
              : "invoices"}{" "}
            with an outstanding
            balance.
          </span>
        </div>
      )}
    </div>
  );
}

interface BookingFinanceWorkspaceProps {
  booking: AdminBookingDetailsResponse;
  onClose: ()=>void;

  initialMode?:
    | "OVERVIEW"
    | "CREATE_INVOICE"
    | "ISSUE_INVOICE"
    | "RECORD_PAYMENT";

}

type FinanceView =
  | {
      type: "OVERVIEW";
    }
  | {
      type: "CREATE_INVOICE";
    }
  | {
      type: "INVOICE";
      invoice: Invoice;
    }
  | {
      type: "PAYMENT";
      invoice: Invoice;
    };

export function BookingFinanceWorkspace({ booking, onClose, initialMode = "OVERVIEW" }: BookingFinanceWorkspaceProps) {

  const { id: bookingId, currency, invoices } = booking;
  const quote = booking.quote

  const [view, setView] =
  useState<FinanceView>(() =>
    getInitialFinanceView(
      initialMode,
      invoices
    )
  );

  const financial = useMemo(
    () =>
      getBookingFinancialSummary(
        invoices
      ),
    [invoices]
  );

  if (view.type === "PAYMENT") {
    return (
      <RecordPaymentView
        bookingId={bookingId}
        invoice={view.invoice}
        onBack={() =>
          setView({
            type: "OVERVIEW",
          })
        }
        onSuccess={() =>
          setView({
            type: "OVERVIEW",
          })
        }
      />
    );
  }

  if(view.type === "CREATE_INVOICE" && quote){
    return (
      <div className="p-6">
        <BookingInvoice booking={booking} quote={quote} onRevise={()=>setView({type:'OVERVIEW'})} onClose={onClose} />
      </div>
    )
  }

  return (
    <div className="flex flex-col">
        <FinanceSummary
          financial={financial}
          fallbackCurrency={currency}
        />

        <Separator />

      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold">
              Invoices
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Review invoices and record
              payments received.
            </p>
          </div>

          <Button
            size="sm"
            onClick={() =>
              setView({
                type: "CREATE_INVOICE",
              })
            }
          >
            <Plus className="size-4" />
            New invoice
          </Button>
        </div>

        {invoices.length === 0 ? (
          <EmptyInvoices
            onCreateInvoice={() =>
              setView({
                type: "CREATE_INVOICE",
              })
            }
          />
        ) : (
          <div className="space-y-2">
            {invoices.map(
              (invoice) => (
                <InvoiceRow
                  key={invoice.id}
                  invoice={invoice}
                  onView={() =>
                    setView({
                      type: "INVOICE",
                      invoice,
                    })
                  }
                  onRecordPayment={() =>
                    setView({
                      type: "PAYMENT",
                      invoice,
                    })
                  }
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function getInitialFinanceView(
  mode:
    | "OVERVIEW"
    | "CREATE_INVOICE"
    | "ISSUE_INVOICE"
    | "RECORD_PAYMENT",
  invoices: Invoice[]
): FinanceView {
  if (mode === "CREATE_INVOICE") {
    return {
      type: "CREATE_INVOICE",
    };
  }

  if (mode === "ISSUE_INVOICE") {
    const draftInvoice =
      invoices.find(
        (invoice) =>
          invoice.status === "DRAFT"
      );

    if (draftInvoice) {
      return {
        type: "INVOICE",
        invoice: draftInvoice,
      };
    }
  }

  if (mode === "RECORD_PAYMENT") {
    const payableInvoice =
      invoices.find(
        (invoice) => {
          if (
            invoice.status !== "ISSUED"
          ) {
            return false;
          }

          const summary =
            getInvoiceFinancialSummary(
              invoice
            );

          return (
            summary.outstandingAmount >
            0
          );
        }
      );

    if (payableInvoice) {
      return {
        type: "PAYMENT",
        invoice: payableInvoice,
      };
    }
  }

  return {
    type: "OVERVIEW",
  };
}

interface SummaryAmountProps {
  label: string;
  amount: number;
  currency: string;
  emphasize?: boolean;
}

interface InvoiceStatusBadgeProps {
  invoice: Invoice;

  summary: ReturnType<
    typeof getInvoiceFinancialSummary
  >;
}

function InvoiceStatusBadge({
  invoice,
  summary,
}: InvoiceStatusBadgeProps) {
  if (invoice.status === "VOID") {
    return (
      <Badge variant="secondary">
        Void
      </Badge>
    );
  }

  if (invoice.status === "DRAFT") {
    return (
      <Badge variant="secondary">
        Draft
      </Badge>
    );
  }

  if (
    invoice.status === "PAID"
  ) {
    return (
      <Badge className="border-0 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
        <CheckCircle2 className="mr-1 size-3" />
        Paid
      </Badge>
    );
  }

  if (summary.isOverdue) {
    return (
      <Badge className="border-0 bg-rose-50 text-rose-700 hover:bg-rose-50">
        Overdue
      </Badge>
    );
  }

  if (summary.isPartiallyPaid) {
    return (
      <Badge className="border-0 bg-amber-50 text-amber-700 hover:bg-amber-50">
        Partially paid
      </Badge>
    );
  }

  return (
    <Badge className="border-0 bg-blue-50 text-blue-700 hover:bg-blue-50">
      Issued
    </Badge>
  );
}

function SummaryAmount({
  label,
  amount,
  currency,
  emphasize = false,
}: SummaryAmountProps) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p
        className={cn(
          "mt-1 text-sm font-semibold",
          emphasize &&
            amount > 0 &&
            "text-foreground"
        )}
      >
        {formatMoney(
          amount,
          currency
        )}
      </p>
    </div>
  );
}

const financeStateConfig: Record<
  BookingFinancialState,
  {
    label: string;
    className: string;
  }
> = {
  NOT_STARTED: {
    label: "Not invoiced",
    className:
      "bg-slate-100 text-slate-700",
  },

  DRAFT: {
    label: "Draft",
    className:
      "bg-slate-100 text-slate-700",
  },

  INVOICED: {
    label: "Awaiting payment",
    className:
      "bg-blue-50 text-blue-700",
  },

  PARTIALLY_PAID: {
    label: "Partially paid",
    className:
      "bg-amber-50 text-amber-700",
  },

  PAID: {
    label: "Fully paid",
    className:
      "bg-emerald-50 text-emerald-700",
  },

  OVERDUE: {
    label: "Overdue",
    className:
      "bg-rose-50 text-rose-700",
  },
};

interface InvoiceRowProps {
  invoice: Invoice;

  onView: () => void;
  onRecordPayment: () => void;
}

function InvoiceRow({
  invoice,
  onView,
  onRecordPayment,
}: InvoiceRowProps) {
  const summary =
    getInvoiceFinancialSummary(
      invoice
    );

  const canRecordPayment =
    invoice.status === "ISSUED" &&
    summary.outstandingAmount > 0;

  return (
    <div className="rounded-lg border">
      <div className="flex items-center gap-4 p-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <ReceiptText className="size-4 text-muted-foreground" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onView}
              className="text-sm font-semibold hover:underline"
            >
              {invoice.reference}
            </button>

            <InvoiceStatusBadge
              invoice={invoice}
              summary={summary}
            />
          </div>

          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>
              Total{" "}
              {formatMoney(
                summary.totalAmount,
                invoice.currency
              )}
            </span>

            {summary.paidAmount >
              0 && (
              <span>
                Paid{" "}
                {formatMoney(
                  summary.paidAmount,
                  invoice.currency
                )}
              </span>
            )}

            {summary.outstandingAmount >
              0 &&
              !summary.isDraft && (
                <span>
                  Outstanding{" "}
                  {formatMoney(
                    summary.outstandingAmount,
                    invoice.currency
                  )}
                </span>
              )}
          </div>

          {invoice.dueAt &&
            invoice.status ===
              "ISSUED" && (
              <p
                className={cn(
                  "mt-1 text-xs text-muted-foreground",
                  summary.isOverdue &&
                    "text-rose-600"
                )}
              >
                Due{" "}
                {formatDate(
                  invoice.dueAt
                )}
              </p>
            )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {canRecordPayment && (
            <Button
              size="sm"
              variant="outline"
              onClick={
                onRecordPayment
              }
            >
              <Banknote className="size-4" />
              Record payment
            </Button>
          )}

          <Button
            size="icon"
            variant="ghost"
            onClick={onView}
            aria-label={`View ${invoice.reference}`}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function EmptyInvoices({
  onCreateInvoice,
}: {
  onCreateInvoice?: () => void;
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed px-6 py-10 text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-muted">
        <FileText className="size-5 text-muted-foreground" />
      </div>

      <h3 className="mt-3 text-sm font-semibold">
        No invoices yet
      </h3>

      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        Create an invoice to begin
        billing for this booking.
      </p>

      {onCreateInvoice && (
        <Button
          size="sm"
          className="mt-4"
          onClick={
            onCreateInvoice
          }
        >
          <Plus className="size-4" />
          Create invoice
        </Button>
      )}
    </div>
  );
}

interface RecordPaymentViewProps {
  bookingId: string;
  invoice: Invoice;

  onBack: () => void;
  onSuccess: () => void;
}

function RecordPaymentView({
  bookingId,
  invoice,
  onBack,
  onSuccess,
}: RecordPaymentViewProps) {
  const summary =
    getInvoiceFinancialSummary(
      invoice
    );

  return (
    <div>
      <div className="border-b px-6 py-5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="-ml-2 mb-3"
          onClick={onBack}
        >
          ← Back to finance
        </Button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-semibold">
              Record payment
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {invoice.reference}
            </p>
          </div>

          <Badge variant="outline">
            {formatMoney(
              summary.outstandingAmount,
              invoice.currency
            )}{" "}
            outstanding
          </Badge>
        </div>
      </div>

      <RecordPaymentForm
        bookingId={bookingId}
        invoice={invoice}
        outstandingAmount={
          summary.outstandingAmount
        }
        onCancel={onBack}
        onSuccess={onSuccess}
      />
    </div>
  );
}