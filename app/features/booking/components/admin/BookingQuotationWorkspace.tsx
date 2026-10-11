"use client";

import { useState } from "react";

import type { AdminBookingDetailsResponse } from "../../types/admin-booking";
import type { BookingWorkflowAction } from "../../types";
import { PrepareQuote } from "./BookingQuote";
import { Quote } from "@/app/features/quotes/types/quote";
import QuotationDocument from "@/app/features/quotes/components/quotationDoc";

interface QuotationWorkspaceProps {
  booking: AdminBookingDetailsResponse;

  action:
    BookingWorkflowAction["type"];

  onClose: () => void;
}

type QuoteView =
  | "EDIT"
  | "PREVIEW";

function getInitialView(
  action: BookingWorkflowAction["type"],
  hasQuote: boolean
): QuoteView {
  switch (action) {
    case "CREATE_QUOTE":
    case "REVISE_QUOTE":
      case "UPDATE_QUOTE_STATUS":
      return "EDIT";

    case "SEND_QUOTE":
      return hasQuote
        ? "PREVIEW"
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
  const [view, setView] =
    useState<QuoteView>(() =>
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
        action={action as string}
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
        action={action as string}
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