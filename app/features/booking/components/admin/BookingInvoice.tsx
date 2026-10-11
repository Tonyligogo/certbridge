import { AdminBookingDetailsResponse } from "../../types/admin-booking";
import { Quote } from "@/app/features/quotes/types/quote";
import QuotationDocument from "@/app/features/quotes/components/quotationDoc";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateInvoice } from "@/app/features/invoices/hooks/use-invoice";

const BookingInvoice = ({
  booking,
  quote,
  onRevise,
  onClose,
}: {
  booking: AdminBookingDetailsResponse;
  quote: Quote;
  onRevise: () => void;
  onClose: () => void;
}) => {
  const [dueAt, setDueAt] = useState("");
  const [notes, setNotes] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const { mutate: createInvoice, isPending} = useCreateInvoice()

  const handleSubmit = () => {
    const data = {
        dueAt,
        notes
    }
    createInvoice(
  {
    bookingId:booking.id,
    data,
  },
  {
    onSuccess: () => {
      onClose()
    },
  }
);
  }
  return (
    <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-8rem)] gap-6 lg:overflow-hidden">
      <aside className="w-full shrink-0 lg:w-85">
  <div className="rounded-xl bg-background">
    {/* Header */}
    <div className="border-b px-5 py-4">
      <h4 className="font-semibold text-foreground">
        Invoice details
      </h4>

      <p className="mt-1 text-sm leading-5 text-muted-foreground">
        Review the invoice preview and complete the details below before
        creating the invoice.
      </p>
    </div>

    {/* Form */}
    <div className="space-y-6 px-5 py-5">
      {/* Quote source */}
      <div className="rounded-lg border bg-muted/30 p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Based on accepted quote
        </p>

        <div className="mt-1 flex items-center justify-between gap-3">
          <span className="text-sm font-semibold">
            {quote.reference}
          </span>
        </div>

        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          Invoice items, pricing and tax are copied from the accepted quote
          and cannot be changed here.
        </p>
      </div>

      {/* Due date */}
      <div className="space-y-2">
        <div>
          <Label htmlFor="due_date">
            Due date
          </Label>

          <p className="mt-0.5 text-xs text-muted-foreground">
            When payment for this invoice is expected.
          </p>
        </div>

        <Input
          id="due_date"
          type="date"
          min={today}
          value={dueAt}
          required
          onChange={(e) => setDueAt(e.target.value)}
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <div>
          <Label htmlFor="notes">
            Invoice notes
            <span className="ml-1 font-normal text-muted-foreground">
              (optional)
            </span>
          </Label>

          <p className="mt-0.5 text-xs text-muted-foreground">
            Add payment instructions or other information the client should
            see on the invoice.
          </p>
        </div>

        <Textarea
          id="notes"
          rows={4}
          maxLength={1000}
          placeholder="e.g. Payment is due within 30 days."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="resize-none"
        />

        <p className="text-right text-xs text-muted-foreground">
          {notes.length}/1000
        </p>
      </div>
    </div>

    {/* Footer */}
    <div className="border-t bg-muted/20 px-5 py-4">
      <p className="mb-4 text-xs leading-5 text-muted-foreground">
        Creating this invoice will use the amounts shown in the preview.
        You can review it before issuing it to the client.
      </p>

      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={isPending}
        >
          Cancel
        </Button>

        <Button
          type="button"
          disabled={!dueAt || isPending}
          onClick={handleSubmit}
        >
          {isPending ? 'Creating...' : 'Create invoice'}
        </Button>
      </div>
    </div>
  </div>
        </aside>
      <div className="min-w-0 flex-1 overflow-y-auto">
        <QuotationDocument
          booking={booking}
          quote={quote}
          onRevise={onRevise}
          onSent={onClose}
          invoiceDueDate={dueAt}
          invoiceNotes={notes}
          isInvoice={true}
        />
      </div>
    </div>
  );
};

export default BookingInvoice;
