"use client";

import { useState, useMemo } from "react";

import {
  useCreateQuote,
  useUpdateQuote,
  useUpdateQuoteStatus,
} from "@/app/features/quotes/hooks/use-quote";

import type {
  Quote,
  QuoteStatus,
  CreateQuoteItemInput,
} from "@/app/features/quotes/types/quote";

import { QuoteHeader } from "@/app/features/quotes/components/quoteHeader";
import { QuoteItemsCard } from "@/app/features/quotes/components/quoteItemsCard";
import { QuoteNotesCard } from "@/app/features/quotes/components/quoteNotesCard";
import { QuoteSidebar } from "@/app/features/quotes/components/quoteSidebar";
import QuotationDocument from "./quotationDoc";
import { BookingDetails } from "../../booking/types/admin-booking";

interface QuoteEditorProps {
    bookingId:string;
  quote?: Quote | null;
  booking?: BookingDetails
}

export function QuoteEditor({
    bookingId,
  quote,
  booking
}: QuoteEditorProps) {

  const createQuoteMutation = useCreateQuote();
  const updateQuoteMutation = useUpdateQuote();
  const updateQuoteStatusMutation = useUpdateQuoteStatus();

  /*
   * Because QuoteEditor is only rendered after the query has finished,
   * quote is available here on the initial render.
   */
  const [items, setItems] = useState<CreateQuoteItemInput[]>(() => {
    if (quote?.items?.length) {
      return quote.items.map((item) => ({
        name: item.name,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      }));
    }

    return [
      {
        name: "Course Fee",
        quantity: 1,
        unitPrice: 0,
      },
    ];
  });

  const [expiresAt, setExpiresAt] = useState<Date | null>(() =>
    quote?.expiresAt ? new Date(quote.expiresAt) : null
  );

  const [responseNotes, setResponseNotes] = useState(
    quote?.responseNotes ?? ""
  );

  const calculatedSubtotal = useMemo(() => {
    return items.reduce((acc, item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;

      return acc + quantity * unitPrice;
    }, 0);
  }, [items]);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        name: "",
        quantity: 1,
        unitPrice: 0,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      return;
    }

    setItems((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleItemChange = (
    index: number,
    field: keyof CreateQuoteItemInput,
    value: string | number
  ) => {
    setItems((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return updated;
    });
  };

  const handleSaveQuote = () => {
    const payload = {
      expiresAt: expiresAt ? new Date(expiresAt) : null,

      responseNotes:
        responseNotes.trim() || null,

      items: items.map((item) => ({
        name: item.name.trim(),
        quantity: Number(item.quantity) || 0,
        unitPrice: Number(item.unitPrice) || 0,
      })),
    };
    if (quote) {
      updateQuoteMutation.mutate({
        bookingId,
        data: payload,
      });
    } else {
      createQuoteMutation.mutate({
        bookingId,
        data: payload,
      });
    }
  };

  const handleStatusChange = (
    status: QuoteStatus
  ) => {
    updateQuoteStatusMutation.mutate({
      bookingId,
      data: {
        status,
        responseNotes:
          responseNotes.trim() || null,
      },
    });
  };

  const isSaving =
    createQuoteMutation.isPending ||
    updateQuoteMutation.isPending ||
    updateQuoteStatusMutation.isPending;

  return (
    <div className="space-y-6">
      <QuoteHeader
        quote={quote}
        isSaving={isSaving}
        onSave={handleSaveQuote}
        onStatusChange={handleStatusChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 space-y-6">
          <QuoteItemsCard
            items={items}
            subtotal={calculatedSubtotal}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onItemChange={handleItemChange}
          />

          <QuoteNotesCard
            responseNotes={responseNotes}
            onNotesChange={setResponseNotes}
          />
        </div>
        {/* <div className="lg:col-span-2 space-y-6">
          <QuotationDocument
          quote={quote}
          booking={booking}
        />
        </div> */}
       

        <div>
          <QuoteSidebar
            quote={quote}
            subtotal={calculatedSubtotal}
            expiresAt={expiresAt}
            onExpiresAtChange={setExpiresAt}
          />
        </div>
        
      </div>
    </div>
  );
}