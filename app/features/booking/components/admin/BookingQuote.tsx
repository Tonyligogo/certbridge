"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  Loader2,
  Plus,
  ReceiptText,
  Trash2,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AdminBookingDetailsResponse } from "../../types/admin-booking";
import { useCreateQuote, useUpdateQuote } from "@/app/features/quotes/hooks/use-quote";
import { Quote } from "@/app/features/quotes/types/quote";
import BookingStatusToggler from "./BookingStatusToggler";
import { QuoteStatusBadge } from "@/app/features/quotes/components/quoteStatusBadge";


interface QuoteLineItem {
  id: string;
  name: string;
  quantity: string;
  unitPrice: string;
}

interface PrepareQuoteProps {
  booking: AdminBookingDetailsResponse;
  onSaved?: (
    quote?: Quote
  ) => void;
  action:string;
}

function createItem( name = "", quantity = "1", unitPrice = ""): QuoteLineItem {
  return {
    id: crypto.randomUUID(),
    name,
    quantity,
    unitPrice,
  };
}

function calculateAmount( quantity: string, unitPrice: string) {
  const qty = Number(quantity);
  const price = Number(unitPrice);
  if ( !Number.isFinite(qty) || !Number.isFinite(price)) {
    return 0;
  }

  return qty * price;
}

function formatMoney( amount: number, currency: string) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(
  value: string | null | undefined
) {
  if (!value) return "Not scheduled";

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function PrepareQuote({
  booking,
  onSaved,
  action
}: PrepareQuoteProps) {
  /*
   * Populate the form from an existing draft,
   * otherwise create a sensible initial item.
   */ 
  const [expiresAt, setExpiresAt] =
  useState(() =>
    booking.quote?.expiresAt
      ? booking.quote.expiresAt.toString().slice(0, 10)
      : ""
  );
  const [isQuoteResponseOpen, setIsQuoteResponseOpen] = useState(false);
  const {mutate:createQuote, isPending:isCreatingQuote} = useCreateQuote();
  const { mutate: updateQuote, isPending: isUpdatingQuote } = useUpdateQuote();
  const isSavingQuote = isCreatingQuote || isUpdatingQuote;

const [items, setItems] = useState<QuoteLineItem[]>(() => {
    if (
      booking.quote &&
      booking.quote.items.length > 0
    ) {
      return booking.quote.items.map(
        (item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity.toString(),
          unitPrice: item.unitPrice.toString(),
        })
      );
    }

    return [
      createItem(
        booking.course.title,
        "1",
        ""
      ),
    ];
  });

  const currency =
    booking.currency || "KES";

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total +
        calculateAmount(
          item.quantity,
          item.unitPrice
        ),
      0
    );
  }, [items]);

  const canSave =
    items.length > 0 &&
    items.every((item) => {
      const quantity =
        Number(item.quantity);
      const unitPrice =
        Number(item.unitPrice);

      return (
        item.name.trim().length > 0 &&
        Number.isFinite(quantity) &&
        quantity > 0 &&
        Number.isFinite(unitPrice) &&
        unitPrice >= 0
      );
    });

  function updateItem(
    id: string,
    field:
      | "name"
      | "quantity"
      | "unitPrice",
    value: string
  ) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  function addItem() {
    setItems((current) => [
      ...current,
      createItem(),
    ]);
  }

  function removeItem(id: string) {
    setItems((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );
  }

  function handleSubmit() {
    if (!canSave) return;

       const payload = {
      expiresAt: expiresAt
        ? new Date(expiresAt)
        : null,

      items: items.map((item) => ({
        name: item.name.trim(),
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        amount: calculateAmount(
          item.quantity,
          item.unitPrice
        ).toFixed(2),
      })),
    }
    if (booking.quote) {
        updateQuote({
            bookingId: booking.id,
            data: payload,
        },{
        onSuccess: (response) => {
            onSaved?.(response.data);
        },
      }
    );

        return;
    }
    createQuote({
        bookingId:booking.id,
        data: payload,
      },{
        onSuccess: (response) => {
            onSaved?.(response.data);
        },
      }
    );
  }
  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1 space-y-6 p-6">
        {/* Booking context */}
        {booking.quote && (
  <QuoteStatusBadge
    status={booking.quote.status}
  />
)}
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="mb-3 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate font-medium">
                {booking.course.title}
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Booking {booking.reference}
              </p>
            </div>

            <div className="shrink-0 rounded-md border bg-background px-2.5 py-1 text-xs font-medium">
              {currency}
            </div>
          </div>

          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="size-4" />

              <span>
                {booking.participantCount}{" "}
                {booking.participantCount === 1
                  ? "participant"
                  : "participants"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="size-4" />

              <span>
                {formatDate(
                  booking.scheduledStartDate ??
                    booking.preferredStartDate
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Quote validity */}
        <div className="space-y-2">
          <Label htmlFor="quote-expiry">
            Quote valid until
          </Label>

          <Input
            id="quote-expiry"
            type="date"
            value={expiresAt}
            onChange={(event) =>
              setExpiresAt(
                event.target.value
              )
            }
          />

          <p className="text-xs text-muted-foreground">
            Optional. The client should
            accept the quotation before
            this date.
          </p>
        </div>

        <Separator />

        {/* Line items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold">
                Quote items
              </h3>

              <p className="text-xs text-muted-foreground">
                Add the services and costs
                included in this quotation.
              </p>
            </div>

            <Button
              type="button"
              size="sm"
              variant="outline"
              className="shrink-0 gap-1.5"
              onClick={addItem}
            >
              <Plus className="size-3.5" />
              Add item
            </Button>
          </div>

          <div className="space-y-3">
            {items.map(
              (item, index) => {
                const amount =
                  calculateAmount(
                    item.quantity,
                    item.unitPrice
                  );

                return (
                  <div
                    key={item.id}
                    className="rounded-lg border p-4"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ReceiptText className="size-4 text-muted-foreground" />

                        <span className="text-sm font-medium">
                          Item {index + 1}
                        </span>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        disabled={
                          items.length === 1
                        }
                        onClick={() =>
                          removeItem(item.id)
                        }
                      >
                        <Trash2 className="size-4" />

                        <span className="sr-only">
                          Remove item
                        </span>
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor={`item-${item.id}-name`}
                        >
                          Description
                        </Label>

                        <Input
                          id={`item-${item.id}-name`}
                          placeholder="e.g. Training fee"
                          value={item.name}
                          onChange={(event) =>
                            updateItem(
                              item.id,
                              "name",
                              event.target.value
                            )
                          }
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label
                            htmlFor={`item-${item.id}-quantity`}
                          >
                            Quantity
                          </Label>

                          <Input
                            id={`item-${item.id}-quantity`}
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={
                              item.quantity
                            }
                            onChange={(
                              event
                            ) =>
                              updateItem(
                                item.id,
                                "quantity",
                                event.target
                                  .value
                              )
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor={`item-${item.id}-price`}
                          >
                            Unit price
                          </Label>

                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                              {currency}
                            </span>

                            <Input
                              id={`item-${item.id}-price`}
                              type="number"
                              min="0"
                              step="0.01"
                              className="pl-12"
                              placeholder="0.00"
                              value={
                                item.unitPrice
                              }
                              onChange={(
                                event
                              ) =>
                                updateItem(
                                  item.id,
                                  "unitPrice",
                                  event.target
                                    .value
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t pt-3">
                        <span className="text-xs text-muted-foreground">
                          Amount
                        </span>

                        <span className="text-sm font-medium tabular-nums">
                          {formatMoney(
                            amount,
                            currency
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* Total */}
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Quote total
            </span>

            <span className="text-lg font-semibold tabular-nums">
              {formatMoney(
                subtotal,
                currency
              )}
            </span>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            {items.length}{" "}
            {items.length === 1
              ? "line item"
              : "line items"}
          </p>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 border-t bg-background p-4">
        <div className="flex items-center justify-end gap-2">
          { action === 'UPDATE_QUOTE_STATUS' &&
            <Button variant="outline" onClick={()=>setIsQuoteResponseOpen(true)}>Update Quote Status</Button>
          }
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={
              !canSave || isSavingQuote
            }
            className="min-w-32"
          >
            {isSavingQuote ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : booking.quote ? (
              "Update Draft"
            ) : (
              "Save Draft"
            )}
          </Button>
        </div>
      </div>
      { action === 'UPDATE_QUOTE_STATUS' && isQuoteResponseOpen && booking.quote &&
        <BookingStatusToggler bookingId={booking.id} open={isQuoteResponseOpen} onOpenChange={setIsQuoteResponseOpen} />
      }
    </div>
  );
}