"use client";

import { useState } from "react";

import type { AdminBookingDetailsResponse } from "../../types/admin-booking";
import type { BookingWorkflowAction } from "../../types";
import { PrepareQuote } from "./BookingQuote";
import { Quote } from "@/app/features/quotes/types/quote";
import QuotationDocument from "@/app/features/quotes/components/quotationDoc";
import BookingQuoteResponse from "./BookingQuoteResponse";

interface QuotationWorkspaceProps {
  booking: AdminBookingDetailsResponse;

  action:
    BookingWorkflowAction["type"];

  onClose: () => void;
}

type QuoteView =
  | "EDIT"
  | "PREVIEW"
  | "RECORD_RESPONSE";

function getInitialView(
  action: BookingWorkflowAction["type"],
  hasQuote: boolean
): QuoteView {
  switch (action) {
    case "CREATE_QUOTE":
    case "REVISE_QUOTE":
      return "EDIT";

    case "SEND_QUOTE":
      return hasQuote
        ? "PREVIEW"
        : "EDIT";

    case "UPDATE_QUOTE_STATUS":
      return hasQuote
        ? "RECORD_RESPONSE"
        : "EDIT";

    default:
      return hasQuote
        ? "PREVIEW"
        : "EDIT";
  }
}

export function QuotationWorkspace({
  booking,
  action,
  onClose,
}: QuotationWorkspaceProps) {
  const [view, setView] = useState<QuoteView>(() =>
      getInitialView(
        action,
        Boolean(booking.quote)
      )
    );

    const [currentQuote, setCurrentQuote] = useState<Quote | undefined | null>(booking.quote ? booking.quote : null);

  if (view === "EDIT") {
    return (
      <PrepareQuote
        booking={booking}
        onSaved={(quote) => {
             setCurrentQuote(quote);
            setView("PREVIEW");
        }}
        />
    );
  }
  if (view === "RECORD_RESPONSE") {
    return (
      <BookingQuoteResponse
        bookingId={booking.id}
        onSuccess={onClose}
      />
    );
  }

  if (!currentQuote) {
    return (
      <PrepareQuote
        booking={booking}
        onSaved={(quote) => {
            setCurrentQuote(quote);
            setView("PREVIEW");
        }}
        />
    );
  }

  return (
    <QuotationDocument
      booking={booking}
      quote={currentQuote}
      onRevise={() =>
        setView("EDIT")
      }
      onSent={onClose}
    />
  );
}