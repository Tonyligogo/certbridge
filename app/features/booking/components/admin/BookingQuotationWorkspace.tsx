"use client";

import { useState } from "react";

import type { AdminBookingDetailsResponse } from "../../types/admin-booking";
import type { BookingWorkflowAction } from "../../types";

import { PrepareQuote } from "./BookingQuote";
import { Quote } from "@/app/features/quotes/types/quote";
import QuotationDocument from "@/app/features/quotes/components/quotationDoc";
import BookingQuoteResponse from "./BookingQuoteResponse";

type QuoteView = "EDIT" | "PREVIEW" | "RECORD_RESPONSE";

interface QuotationWorkspaceProps {
  booking: AdminBookingDetailsResponse;
  action: BookingWorkflowAction["type"];
  onClose: () => void;

  // Optional quotation to open directly
  quoteId?: string;
}

const ACTIVE_QUOTE_STATUSES = [
  "DRAFT",
  "ISSUED",
  "SENT",
  "ACCEPTED",
] as const;

function getInitialView(
  action: BookingWorkflowAction["type"],
  hasQuote: boolean
): QuoteView {
  switch (action) {
    case "CREATE_QUOTE":
    case "REVISE_QUOTE":
      return "EDIT";

    case "SEND_QUOTE":
    case "ISSUE_QUOTE":
    case "VIEW_QUOTE":
      return hasQuote ? "PREVIEW" : "EDIT";

    case "UPDATE_QUOTE_STATUS":
      return hasQuote ? "RECORD_RESPONSE" : "EDIT";

    default:
      return hasQuote ? "PREVIEW" : "EDIT";
  }
}

export function QuotationWorkspace({
  booking,
  action,
  onClose,
  quoteId,
}: QuotationWorkspaceProps) {
  const quotes = [...booking.quotes].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );

  const activeQuote =
    quotes.find((quote) =>
      ACTIVE_QUOTE_STATUSES.some(
        (status) => status === quote.status
      )
    ) ?? null;

  const latestQuote = quotes[0] ?? null;

  const initialQuote = quoteId
    ? quotes.find((quote) => quote.id === quoteId) ?? null
    : activeQuote ?? latestQuote;

  const [currentQuote, setCurrentQuote] = useState<Quote | null | undefined>(
    initialQuote as Quote | null | undefined
  );

  const [view, setView] = useState<QuoteView>(() =>
    getInitialView(action, Boolean(initialQuote))
  );

  const handleSaved = (quote: Quote | undefined) => {
    setCurrentQuote(quote);
    setView("PREVIEW");
  };

  const canEditCurrentQuote =
    currentQuote?.status === "DRAFT";

  // Prevent creating another quotation while one is active.
  const canCreateNewQuote = !activeQuote;

  if (view === "EDIT") {
    if (
      action === "CREATE_QUOTE" ||
      action === "REVISE_QUOTE"
    ) {
      if (!canCreateNewQuote) {
        return (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="text-sm font-medium">
              An active quotation already exists.
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              The existing quotation must be closed or voided
              before preparing another quotation.
            </p>
          </div>
        );
      }
    } else if (!canEditCurrentQuote) {
      setView("PREVIEW");
      return null;
    }

    return (
      <PrepareQuote
  key={quoteId ?? "new"}
  booking={booking}
  quoteId={quoteId}
  onSaved={handleSaved}
/>
    );
  }

  if (view === "RECORD_RESPONSE") {
    if (!currentQuote || currentQuote.status !== "SENT") {
      return (
        <div className="rounded-lg border border-dashed p-6">
          <p className="text-sm text-muted-foreground">
            Only a sent quotation can have its response recorded.
          </p>
        </div>
      );
    }

    return (
      <BookingQuoteResponse
        bookingId={booking.id}
        onSuccess={onClose}
      />
    );
  }

  if (!currentQuote) {
    return (
      <div className="rounded-lg border border-dashed p-6">
        <p className="text-sm text-muted-foreground">
          No quotation is available to preview.
        </p>
      </div>
    );
  }

  return (
    <QuotationDocument
      booking={booking}
      quote={currentQuote}
      onRevise={() => {
        if (currentQuote.status === "DRAFT") {
          setView("EDIT");
        }
      }}
      onSent={onClose}
    />
  );
}