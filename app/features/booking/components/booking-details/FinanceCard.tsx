"use client";

import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileText,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";
import type { BookingFinancialState, BookingFinancialSummary } from "../../lib/get-booking-financial-state";
import { formatMoney } from "../../utils/utils";

interface FinanceCardProps {
  financial: BookingFinancialSummary;
  onOpenFinance: () => void;
}

export function FinanceCard({
  financial,
  onOpenFinance,
}: FinanceCardProps) {
  const config =
    financialStateConfig[
      financial.state
    ];

  const StateIcon =
    config.icon;

  const canRecordPayment =
    financial.hasIssuedInvoices &&
    financial.hasOutstandingBalance;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">
              Finance
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Invoices and payments
            </p>
          </div>

          <Badge
            variant="secondary"
            className={cn(
              "gap-1.5 border-0 font-medium",
              config.className
            )}
          >
            <StateIcon className="size-3.5" />

            {config.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {financial.hasInvoices ? (
          <>
            <div className="grid grid-cols-3 gap-3">
              <FinancialMetric
                label="Invoiced"
                value={formatMoney(
                  financial.totalInvoiced,
                  financial.currency
                )}
              />

              <FinancialMetric
                label="Paid"
                value={formatMoney(
                  financial.totalPaid,
                  financial.currency
                )}
              />

              <FinancialMetric
                label="Outstanding"
                value={formatMoney(
                  financial.totalOutstanding,
                  financial.currency
                )}
                emphasize={
                  financial.totalOutstanding >
                  0
                }
              />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-4 text-sm text-muted-foreground">
              <span>
                {financial.activeInvoiceCount}{" "}
                {financial.activeInvoiceCount ===
                1
                  ? "invoice"
                  : "invoices"}
              </span>

              {financial.draftInvoiceCount >
                0 && (
                <span>
                  {
                    financial.draftInvoiceCount
                  }{" "}
                  draft
                </span>
              )}

              {financial.overdueInvoiceCount >
                0 && (
                <span className="flex items-center gap-1 text-rose-600">
                  <AlertCircle className="size-3.5" />

                  {
                    financial.overdueInvoiceCount
                  }{" "}
                  overdue
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-dashed px-4 py-5">
            <div className="flex gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <FileText className="size-4 text-muted-foreground" />
              </div>

              <div>
                <p className="text-sm font-medium">
                  No invoices yet
                </p>

                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  Create an invoice once the
                  commercial terms are ready.
                </p>
              </div>
            </div>
          </div>
        )}

        <div>
              <Button
                size="sm"
                variant="outline"
                onClick={
                  onOpenFinance
                }
              >
                Action
              </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const financialStateConfig: Record<
  BookingFinancialState,
  {
    label: string;
    icon: typeof Banknote;
    className: string;
  }
> = {
  NOT_STARTED: {
    label: "Not invoiced",
    icon: FileText,
    className:
      "bg-slate-100 text-slate-700",
  },

  DRAFT: {
    label: "Invoice draft",
    icon: FileText,
    className:
      "bg-slate-100 text-slate-700",
  },

  INVOICED: {
    label: "Awaiting payment",
    icon: Clock3,
    className:
      "bg-blue-50 text-blue-700",
  },

  PARTIALLY_PAID: {
    label: "Partially paid",
    icon: CircleDollarSign,
    className:
      "bg-amber-50 text-amber-700",
  },

  PAID: {
    label: "Fully paid",
    icon: CheckCircle2,
    className:
      "bg-emerald-50 text-emerald-700",
  },

  OVERDUE: {
    label: "Payment overdue",
    icon: AlertCircle,
    className:
      "bg-rose-50 text-rose-700",
  },
};

interface FinancialMetricProps {
  label: string;
  value: string;
  emphasize?: boolean;
}

function FinancialMetric({
  label,
  value,
  emphasize = false,
}: FinancialMetricProps) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p
        className={cn(
          "mt-1 truncate text-sm font-semibold",
          emphasize &&
            "text-foreground"
        )}
        title={value}
      >
        {value}
      </p>
    </div>
  );
}