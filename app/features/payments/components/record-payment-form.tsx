"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";


import type {
  PaymentMethod,
} from "@/generated/prisma/browser";

import { Banknote } from "lucide-react";
import { formatMoney } from "../../booking/utils/utils";
import type { Invoice } from "../../invoices/types/invoice";
import { useRecordPayment } from "../hooks/use-payments";

interface RecordPaymentFormProps {
  bookingId: string;
  invoice: Invoice;

  outstandingAmount: number;

  onCancel: () => void;
  onSuccess: () => void;
}

const paymentMethods: Array<{
  value: PaymentMethod;
  label: string;
}> = [
  {
    value: "BANK_TRANSFER",
    label: "Bank transfer",
  },
  {
    value: "MOBILE_MONEY",
    label: "Mobile Money",
  },
  {
    value: "CARD",
    label: "Card",
  },
  {
    value: "CASH",
    label: "Cash",
  },
  {
    value: "CHEQUE",
    label: "Cheque",
  },
  {
    value: "OTHER",
    label: "Other",
  },
];

export function RecordPaymentForm({
  bookingId,
  invoice,
  outstandingAmount,
  onCancel,
  onSuccess,
}: RecordPaymentFormProps) {
  const recordPayment =
    useRecordPayment();

  const [amount, setAmount] =
    useState("");

  const [method, setMethod] =
    useState<PaymentMethod>(
      "BANK_TRANSFER"
    );

  const [
    transactionReference,
    setTransactionReference,
  ] = useState("");

  const [notes, setNotes] =
    useState("");

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    const parsedAmount =
      Number(amount);

    if (
      !amount ||
      parsedAmount <= 0
    ) {
      toast.error(
        "Enter a valid payment amount."
      );
      return;
    }

    if (
      parsedAmount >
      outstandingAmount
    ) {
      toast.error(
        "Payment cannot exceed the outstanding balance."
      );
      return;
    }

    try {
      await recordPayment.mutateAsync({
        bookingId,
        invoiceId: invoice.id,

        data: {
          amount,

          currency:
            invoice.currency as
              | "KES"
              | "USD"
              | "EUR"
              | "GBP",

          method,

          transactionReference:
            transactionReference.trim() ||
            null,

          paidAt:
            new Date().toISOString(),

          notes:
            notes.trim() ||
            null,
        },
      });

      toast.success(
        "Payment recorded successfully."
      );

      onSuccess();
    } catch (error) {
      toast.error(
        "Failed to record payment."
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6"
    >
      <div className="rounded-lg border bg-muted/30 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Invoice total
          </span>

          <span className="font-medium">
            {formatMoney(
              Number(
                invoice.totalAmount
              ),
              invoice.currency
            )}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Outstanding
          </span>

          <span className="font-semibold">
            {formatMoney(
              outstandingAmount,
              invoice.currency
            )}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="payment-amount">
          Amount received
        </Label>

        <div className="flex">
          <div className="flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">
            {invoice.currency}
          </div>

          <Input
            id="payment-amount"
            inputMode="decimal"
            value={amount}
            onChange={(event) =>
              setAmount(
                event.target.value
              )
            }
            placeholder="0.00"
            className="rounded-l-none"
          />
        </div>

        <button
          type="button"
          className="text-xs font-medium text-primary hover:underline"
          onClick={() =>
            setAmount(
              outstandingAmount.toFixed(
                2
              )
            )
          }
        >
          Use full outstanding balance
        </button>
      </div>

      <div className="space-y-2">
        <Label>
          Payment method
        </Label>

        <Select
          value={method}
          onValueChange={(value) =>
            setMethod(
              value as PaymentMethod
            )
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {paymentMethods.map(
              (option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="transaction-reference">
          Transaction reference
        </Label>

        <Input
          id="transaction-reference"
          value={
            transactionReference
          }
          onChange={(event) =>
            setTransactionReference(
              event.target.value
            )
          }
          placeholder="e.g. MPESA code or bank reference"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="payment-notes">
          Notes
        </Label>

        <Textarea
          id="payment-notes"
          value={notes}
          onChange={(event) =>
            setNotes(
              event.target.value
            )
          }
          placeholder="Optional payment notes"
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-2 border-t pt-5">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={
            recordPayment.isPending
          }
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={
            recordPayment.isPending
          }
        >
          <Banknote className="size-4" />

          {recordPayment.isPending
            ? "Recording..."
            : "Record payment"}
        </Button>
      </div>
    </form>
  );
}