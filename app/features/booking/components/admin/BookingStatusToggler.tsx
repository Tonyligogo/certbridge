"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useUpdateQuoteStatus } from "@/app/features/quotes/hooks/use-quote";
import { FormDialog } from "@/components/form-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type ClientQuoteResponse = "ACCEPTED" | "DECLINED";

interface BookingStatusTogglerProps {
  bookingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BookingStatusToggler = ({
  bookingId,
  open,
  onOpenChange,
}: BookingStatusTogglerProps) => {
  const [quoteResponse, setQuoteResponse] =
    useState<ClientQuoteResponse | "">("");

  const [responseNotes, setResponseNotes] =
    useState("");

  const {
    mutateAsync: updateQuote,
    isPending,
  } = useUpdateQuoteStatus();

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    // Reset the form whenever the dialog closes
    if (!nextOpen) {
      setQuoteResponse("");
      setResponseNotes("");
    }
  };

  const handleQuoteResponse = async () => {
    if (!quoteResponse) return;

    try {
      await updateQuote({
        bookingId,
        data: {
          status: quoteResponse,
          responseNotes:
            responseNotes.trim() || null,
        },
      });

      toast.success(
        quoteResponse === "ACCEPTED"
          ? "Quotation marked as accepted."
          : "Quotation marked as declined."
      );

      handleOpenChange(false);
    } catch (error) {
      console.error(
        "Failed to update quote response:",
        error
      );

      toast.error(
        "Failed to update quotation. Please try again."
      );
    }
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Record Client Response"
      description="Update the quotation based on the client's response."
      onSubmit={handleQuoteResponse}
      isPending={isPending}
      submitDisabled={!quoteResponse}
      submitLabel="Update Quote"
      loadingLabel="Updating..."
    >
      {/* Client response */}
      <div className="space-y-2">
        <label
          htmlFor="quote-response"
          className="text-sm font-medium"
        >
          Client response
        </label>

        <Select
          value={quoteResponse}
          onValueChange={(value) =>
            setQuoteResponse(
              value as ClientQuoteResponse
            )
          }
        >
          <SelectTrigger id="quote-response">
            <SelectValue placeholder="Select client response" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ACCEPTED">
              Accepted
            </SelectItem>

            <SelectItem value="DECLINED">
              Declined
            </SelectItem>
          </SelectContent>
        </Select>

        <p className="text-xs text-muted-foreground">
          Select the response received from the client.
        </p>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label
          htmlFor="response-notes"
          className="text-sm font-medium"
        >
          Response notes
          <span className="ml-1 font-normal text-muted-foreground">
            (optional)
          </span>
        </label>

        <Textarea
          id="response-notes"
          value={responseNotes}
          onChange={(event) =>
            setResponseNotes(event.target.value)
          }
          placeholder={
            quoteResponse === "DECLINED"
              ? "e.g. Client requested revised pricing..."
              : "Add any relevant notes about the client's response..."
          }
          rows={4}
        />
      </div>
    </FormDialog>
  );
};

export default BookingStatusToggler;