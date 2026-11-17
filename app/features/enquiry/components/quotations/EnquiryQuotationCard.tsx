"use client";

import { ArrowUpRight, FilePenLine, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EnquiryQuote } from "../../types";

const STATUS: Record<string, { label: string; className: string }> = {
  DRAFT: { label: "Draft", className: "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300" },
  ISSUED: { label: "Issued", className: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  SENT: { label: "Sent", className: "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300" },
  ACCEPTED: { label: "Accepted", className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  DECLINED: { label: "Declined", className: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300" },
  EXPIRED: { label: "Expired", className: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  CANCELLED: { label: "Cancelled", className: "bg-muted text-muted-foreground" },
  VOIDED: { label: "Voided", className: "bg-muted text-muted-foreground" },
};

function date(value: string | null | undefined) {
  return value ? new Intl.DateTimeFormat("en-KE", { dateStyle: "medium", timeZone: "Africa/Nairobi" }).format(new Date(value)) : null;
}
function money(value: string, currency: string) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return `${currency} ${value}`;
  return `${currency} ${new Intl.NumberFormat("en-KE", { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(amount)}`;
}

interface Props {
  quote: EnquiryQuote;
  canManage: boolean;
  onView: (quoteId: string) => void;
  onEdit: (quoteId: string) => void;
}

export function EnquiryQuotationCard({ quote, canManage, onView, onEdit }: Props) {
  const status = STATUS[quote.status] ?? { label: quote.status, className: "bg-muted text-muted-foreground" };
  const canEdit = canManage && quote.status === "DRAFT" && !quote.issueToken;
  return (
    <article className="rounded-xl border bg-card p-4 shadow-xs transition-colors hover:border-foreground/20">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted/60"><FileText className="size-5 text-muted-foreground" /></div>
          <div className="min-w-0"><p className="truncate text-sm font-semibold">{quote.reference}</p><p className="text-xs text-muted-foreground">Created {date(quote.createdAt)}</p></div>
        </div>
        <Badge variant="secondary" className={status.className}>{status.label}</Badge>
      </div>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-2">
        <div><p className="text-xs text-muted-foreground">Quotation total</p><p className="mt-1 text-xl font-semibold tracking-tight tabular-nums">{money(quote.totalAmount, quote.currency)}</p></div>
        <p className="text-xs text-muted-foreground">{quote.expiresAt ? `Expires ${date(quote.expiresAt)}` : "No expiry date"}</p>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t pt-3">
        <Button type="button" variant="outline" size="sm" onClick={() => onView(quote.id)}><ArrowUpRight className="size-4" /> View details</Button>
        {canEdit && <Button type="button" size="sm" onClick={() => onEdit(quote.id)}><FilePenLine className="size-4" /> Edit draft</Button>}
      </div>
    </article>
  );
}
