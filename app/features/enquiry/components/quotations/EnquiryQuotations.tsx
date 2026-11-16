"use client";

import {
  FilePlus2,
  Loader2,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EnquiryQuotationCard } from "./EnquiryQuotationCard";
import { useEnquiryQuotations } from "../../hooks/use-enquiry-quotations";
import type { AdminEnquiryDetail } from "../../types";
import { EnquiryQuotationEditor } from "./EnquiryQuotationEditor";
import { EnquiryQuotationDetails } from "./EnquiryQuotationDetails";

type View =
  | { mode: "list" }
  | { mode: "create" }
  | { mode: "edit" | "details"; quoteId: string };

interface Props {
  enquiry: AdminEnquiryDetail;
}

export function EnquiryQuotations({ enquiry }: Props) {
  const [view, setView] = useState<View>({ mode: "list" });
  const canManage =
    enquiry.status !== "CLOSED" && enquiry.status !== "CONVERTED";
  // The component is mounted only when the Quotations tab is active.
  const {
    data: quotes = [],
    isPending,
    isError,
    refetch,
    isFetching,
  } = useEnquiryQuotations(enquiry.id);

  if (view.mode !== "list") {
    const selectedQuote = "quoteId" in view
  ? quotes.find(q => q.id === view.quoteId)
  : undefined;

if (view.mode === "details") {
  if (!selectedQuote) return <div className="p-5">Quotation not found. <Button onClick={() => setView({mode:"list"})}>Back</Button></div>;
  return <EnquiryQuotationDetails
    enquiryId={enquiry.id}
    enquiryEmail={enquiry.email}
    quote={selectedQuote}
    canManage={canManage}
    onBack={() => setView({mode:"list"})}
    onEdit={quoteId => setView({mode:"edit", quoteId})}
  />;
}

return <EnquiryQuotationEditor
  key={view.mode === "edit" ? view.quoteId : "new"}
  enquiry={enquiry}
  quote={view.mode === "edit" ? selectedQuote : undefined}
  onCancel={() => setView({mode:"list"})}
  onSuccess={() => setView({mode:"list"})}
/>;
  }

  return (
    <section className="space-y-5 px-5 py-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">Quotations</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage quotations for this enquiry.
          </p>
        </div>
        {canManage && (
          <Button
            type="button"
            size="sm"
            onClick={() => setView({ mode: "create" })}
          >
            <Plus className="size-4" /> New quotation
          </Button>
        )}
      </div>
      {isPending ? (
        <div className="space-y-3" aria-label="Loading quotations">
          {[0, 1].map((i) => (
            <div key={i} className="space-y-4 rounded-xl border p-4">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-7 w-44" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed px-6 py-12 text-center">
          <p className="text-sm font-semibold">Could not load quotations</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Please try again.
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="mt-4"
            disabled={isFetching}
            onClick={() => void refetch()}
          >
            {isFetching ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}{" "}
            Retry
          </Button>
        </div>
      ) : quotes.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed bg-muted/20 px-6 py-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-background shadow-xs">
            <FilePlus2 className="size-6 text-muted-foreground" />
          </div>
          <h4 className="mt-4 text-sm font-semibold">No quotations yet</h4>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            {canManage
              ? "Create a quotation to prepare pricing for this enquiry."
              : "No quotations were created before this enquiry was closed."}
          </p>
          {canManage && (
            <Button
              type="button"
              size="sm"
              className="mt-5"
              onClick={() => setView({ mode: "create" })}
            >
              <Plus className="size-4" /> Create quotation
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {quotes.map((quote) => (
            <EnquiryQuotationCard
              key={quote.id}
              quote={quote}
              canManage={canManage}
              onView={(quoteId) => setView({ mode: "details", quoteId })}
              onEdit={(quoteId) => setView({ mode: "edit", quoteId })}
            />
          ))}
        </div>
      )}
    </section>
  );
}
