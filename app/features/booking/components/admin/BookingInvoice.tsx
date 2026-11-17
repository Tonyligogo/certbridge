import { AdminBookingDetailsResponse } from "../../types/admin-booking";
import { Quote } from "@/app/features/quotes/types/quote";
import QuotationDocument from "@/app/features/quotes/components/quotationDoc";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateInvoice, useSendInvoiceEmail } from "@/app/features/invoices/hooks/use-invoice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [status, setStatus] = useState<"DRAFT" | "ISSUED">("DRAFT");
  const today = new Date().toISOString().slice(0, 10);
  const { mutate: createInvoice, isPending } = useCreateInvoice();
  const {mutateAsync: sendInvoiceEmail, isPending:isSendingInvoice} = useSendInvoiceEmail();

  const handleSubmit = () => {
    const data = {
      dueAt,
      notes,
      status,
    };
    createInvoice(
  {
    bookingId: booking.id,
    data,
  },
  {
    onSuccess: async (response) => {
      const invoice = response.data;

      if (!invoice) return;

      // Only send invoices that were successfully issued.
      if (invoice.status === "ISSUED") {
        try {
          await sendInvoiceEmail({
            bookingId: booking.id,
            invoiceId: invoice.id,
          });

        } catch (error) {
          console.error(error)
        }
      }
      onClose();
    },
  }
);
  };
  return (
    <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-8rem)] gap-6 lg:overflow-hidden">
      <aside className="w-full shrink-0 lg:w-85">
        <div className="">
          {/* Form */}
          <div className="space-y-6 px-5 py-5">
            {/* Quote source */}
            <div className="rounded-lg bg-white border border-blue-100 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Based on accepted quote
              </p>

              <div className="mt-1 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold">{quote.reference}</span>
              </div>

              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Invoice items, pricing and tax are copied from the accepted
                quote and cannot be changed here.
              </p>
            </div>

            {/* Due date */}
            <div className="space-y-2">
              <div>
                <Label htmlFor="due_date">Due date</Label>
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
            <div className="space-y-2">
              <label htmlFor="invoice-status" className="text-sm font-medium">
                Status
              </label>

              <Select
                value={status}
                onValueChange={(value) =>
                  setStatus(value as "DRAFT" | "ISSUED")
                }
              >
                <SelectTrigger id="invoice-status" className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>

                  <SelectItem value="ISSUED">Issued</SelectItem>
                </SelectContent>
              </Select>
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
          <div className="px-5 py-4">

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
                {isPending ? "Creating..." : "Create invoice"}
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
