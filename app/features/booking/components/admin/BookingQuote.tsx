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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AdminBookingDetailsResponse } from "../../types/admin-booking";
import {
  useCreateQuote,
  useUpdateQuote,
} from "@/app/features/quotes/hooks/use-quote";
import { Quote } from "@/app/features/quotes/types/quote";
import { QuoteStatusBadge } from "@/app/features/quotes/components/quoteStatusBadge";
import { formatDate, formatMoney } from "../../utils/utils";
import { TaxType } from "@/generated/prisma/enums";

interface QuoteLineItem {
  id: string;
  name: string;
  quantity: string;
  unitPrice: string;
}

interface PrepareQuoteProps {
  booking: AdminBookingDetailsResponse;
  onSaved?: (quote?: Quote) => void;
}

function createItem(name = "", quantity = "1", unitPrice = ""): QuoteLineItem {
  return {
    id: crypto.randomUUID(),
    name,
    quantity,
    unitPrice,
  };
}

function calculateAmount(quantity: string, unitPrice: string) {
  const qty = Number(quantity);
  const price = Number(unitPrice);
  if (!Number.isFinite(qty) || !Number.isFinite(price)) {
    return 0;
  }

  return qty * price;
}

export function PrepareQuote({ booking, onSaved }: PrepareQuoteProps) {
  /*
   * Populate the form from an existing draft,
   * otherwise create a sensible initial item.
   */
  const [expiresAt, setExpiresAt] = useState(() =>
    booking.quote?.expiresAt
      ? booking.quote.expiresAt.toString().slice(0, 10)
      : "",
  );
  const [taxType, setTaxType] = useState<TaxType>(
    booking.quote?.taxType ?? TaxType.STANDARD,
  );

  const [responseNotes, setResponseNotes] = useState(
    booking.quote?.responseNotes ?? "",
  );
  const { mutate: createQuote, isPending: isCreatingQuote } = useCreateQuote();
  const { mutate: updateQuote, isPending: isUpdatingQuote } = useUpdateQuote();
  const isSavingQuote = isCreatingQuote || isUpdatingQuote;

  const [items, setItems] = useState<QuoteLineItem[]>(() => {
    if (booking.quote && booking.quote.items.length > 0) {
      return booking.quote.items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity.toString(),
        unitPrice: item.unitPrice.toString(),
      }));
    }

    return [createItem(booking.course.title, "1", booking.amount)];
  });

  const currency = booking.currency || "KES";

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) => total + calculateAmount(item.quantity, item.unitPrice),
      0,
    );
  }, [items]);

  const taxRate = taxType === TaxType.STANDARD ? 0.16 : 0;

  const taxAmount = useMemo(
    () => Math.round(subtotal * taxRate * 100) / 100,
    [subtotal, taxRate],
  );

  const totalAmount = subtotal + taxAmount;

  const canSave =
    items.length > 0 &&
    items.every((item) => {
      const quantity = Number(item.quantity);
      const unitPrice = Number(item.unitPrice);

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
    field: "name" | "quantity" | "unitPrice",
    value: string,
  ) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  }

  function addItem() {
    setItems((current) => [...current, createItem()]);
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function handleSubmit(status: "DRAFT" | "SENT") {
    if (!canSave) return;

    const payload = {
      status,

      expiresAt: expiresAt ? new Date(expiresAt) : null,

      taxType,

      responseNotes: responseNotes.trim() || null,

      items: items.map((item) => ({
        name: item.name.trim(),
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        amount: calculateAmount(item.quantity, item.unitPrice).toFixed(2),
      })),
    };
    if (booking.quote) {
      updateQuote(
        {
          bookingId: booking.id,
          data: payload,
        },
        {
          onSuccess: (response) => {
            onSaved?.(response.data);
          },
        },
      );

      return;
    }
    createQuote(
      {
        bookingId: booking.id,
        data: payload,
      },
      {
        onSuccess: (response) => {
          onSaved?.(response.data);
        },
      },
    );
  }
  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1 space-y-6 p-6">
        {/* Booking context */}
        {booking.quote && <QuoteStatusBadge status={booking.quote.status} />}
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="mb-3 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate font-medium">{booking.course.title}</p>

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
                  booking.scheduledStartDate ?? booking.preferredStartDate,
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-5">
          {/* Quote validity */}
          <div className="space-y-2">
            <Label htmlFor="quote-expiry">Quote valid until</Label>

            <Input
              id="quote-expiry"
              type="date"
              value={expiresAt}
              onChange={(event) => setExpiresAt(event.target.value)}
            />

            <p className="text-xs text-muted-foreground">
              Optional. The client should accept the quotation before this date.
            </p>
          </div>

          {/* Tax Type */}
          <div className="space-y-2">
            <Label htmlFor="quote-tax-type">Tax treatment</Label>

            <Select
              value={taxType}
              onValueChange={(value) => setTaxType(value as TaxType)}
            >
              <SelectTrigger id="quote-tax-type" className="w-full">
                <SelectValue placeholder="Select tax treatment" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value={TaxType.STANDARD}>
                  Standard VAT (16%)
                </SelectItem>

                <SelectItem value={TaxType.ZERO_RATED}>
                  Zero-rated (0%)
                </SelectItem>

                <SelectItem value={TaxType.EXEMPT}>VAT Exempt</SelectItem>

                <SelectItem value={TaxType.NONE}>No Tax</SelectItem>
              </SelectContent>
            </Select>

            <p className="text-xs text-muted-foreground">
              Tax is calculated automatically based on the selected treatment.
            </p>
          </div>
        </div>

        <Separator />
        <div className="space-y-2">
          <Label htmlFor="quote-response-notes">
            Response notes{" "}
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
          </Label>

          <Textarea
            id="quote-response-notes"
            value={responseNotes}
            onChange={(event) => setResponseNotes(event.target.value)}
            placeholder="Add any notes, clarifications, or special terms for this quotation..."
            rows={4}
            className="resize-none"
          />

          <p className="text-xs text-muted-foreground">
            Additional information or terms relating to this quotation.
          </p>
        </div>

        {/* Line items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold">Quote items</h3>

              <p className="text-xs text-muted-foreground">
                Add the services and costs included in this quotation.
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
            {items.map((item, index) => {
              const amount = calculateAmount(item.quantity, item.unitPrice);

              return (
                <div key={item.id} className="rounded-lg border p-4">
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
                      disabled={items.length === 1}
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="size-4" />

                      <span className="sr-only">Remove item</span>
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`item-${item.id}-name`}>
                        Description
                      </Label>

                      <Input
                        id={`item-${item.id}-name`}
                        placeholder="e.g. Training fee"
                        value={item.name}
                        onChange={(event) =>
                          updateItem(item.id, "name", event.target.value)
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor={`item-${item.id}-quantity`}>
                          Quantity
                        </Label>

                        <Input
                          id={`item-${item.id}-quantity`}
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={item.quantity}
                          onChange={(event) =>
                            updateItem(item.id, "quantity", event.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`item-${item.id}-price`}>
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
                            value={item.unitPrice}
                            onChange={(event) =>
                              updateItem(
                                item.id,
                                "unitPrice",
                                event.target.value,
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
                        {formatMoney(amount, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Total */}
        <div className="rounded-lg border bg-muted/30 p-4">
          <h3 className="mb-4 text-sm font-semibold">Quote summary</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium tabular-nums">
                {formatMoney(subtotal, currency)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {taxType === TaxType.STANDARD
                  ? "VAT (16%)"
                  : taxType === TaxType.ZERO_RATED
                    ? "VAT (Zero-rated)"
                    : taxType === TaxType.EXEMPT
                      ? "VAT (Exempt)"
                      : "No tax"}
              </span>

              <span className="font-medium tabular-nums">
                {formatMoney(taxAmount, currency)}
              </span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="font-semibold">Quote total</span>

              <span className="text-xl font-bold tabular-nums">
                {formatMoney(totalAmount, currency)}
              </span>
            </div>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            {items.length} {items.length === 1 ? "line item" : "line items"}
          </p>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 border-t bg-background p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {booking.quote?.status === "DRAFT" && (
            <div className="flex justify-end gap-3">
              {(!booking.quote || booking.quote.status === "DRAFT") && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSubmit("DRAFT")}
                  disabled={!canSave || isSavingQuote}
                  className="min-w-32"
                >
                  {isSavingQuote ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : booking.quote ? (
                    "Update Draft"
                  ) : (
                    "Save as Draft"
                  )}
                </Button>
              )}

              <Button
                type="button"
                onClick={() => handleSubmit("SENT")}
                disabled={!canSave || isSavingQuote}
                className="min-w-32"
              >
                {isSavingQuote ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : !booking.quote ? (
                  "Send Quote"
                ) : booking.quote.status === "DRAFT" && (
                  "Update & Send"
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
