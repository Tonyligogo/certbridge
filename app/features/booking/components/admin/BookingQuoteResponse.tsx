
"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";

import { useUpdateQuoteStatus } from "@/app/features/quotes/hooks/use-quote";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ClientQuoteResponse = "ACCEPTED" | "DECLINED";

interface BookingQuoteResponseProps {
  bookingId: string;
  onSuccess?: () => void;
}

export function BookingQuoteResponse({
  bookingId,
  onSuccess,
}: BookingQuoteResponseProps) {
  const [quoteResponse, setQuoteResponse] =
    useState<ClientQuoteResponse | null>(null);

  const [responseNotes, setResponseNotes] = useState("");

  const {
    mutateAsync: updateQuote,
    isPending,
  } = useUpdateQuoteStatus();

  const handleSubmit = async () => {
    if (!quoteResponse || isPending) return;

    try {
      await updateQuote({
        bookingId,
        data: {
          status: quoteResponse,
          responseNotes: responseNotes.trim() || null,
        },
      });

      toast.success(
        quoteResponse === "ACCEPTED"
          ? "Quotation marked as accepted."
          : "Quotation marked as declined."
      );

      setQuoteResponse(null);
      setResponseNotes("");

      onSuccess?.();
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
    <div className="space-y-6 p-6">
      {/* Introduction */}
      <div className="space-y-1">
        <h3 className="text-base font-semibold">
          Record client response
        </h3>

        <p className="text-sm leading-relaxed text-muted-foreground">
          The quotation has been sent to the client.
          Record their response to update the booking
          and proceed with the next steps.
        </p>
      </div>

      {/* Response options */}
      <div className="space-y-3">
        <Label>Client response</Label>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={isPending}
            onClick={() => setQuoteResponse("ACCEPTED")}
            aria-pressed={quoteResponse === "ACCEPTED"}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-left transition-colors",
              "hover:border-emerald-400 hover:bg-emerald-50/50",
              "disabled:cursor-not-allowed disabled:opacity-50",
              quoteResponse === "ACCEPTED"
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                : "border-border"
            )}
          >
            <CheckCircle2
              className={cn(
                "mt-0.5 size-5 shrink-0",
                quoteResponse === "ACCEPTED"
                  ? "text-emerald-600"
                  : "text-muted-foreground"
              )}
            />

            <div className="space-y-1">
              <p className="text-sm font-semibold">
                Accepted
              </p>

              <p className="text-xs leading-relaxed text-muted-foreground">
                The client has approved the quotation.
              </p>
            </div>
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={() => setQuoteResponse("DECLINED")}
            aria-pressed={quoteResponse === "DECLINED"}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-left transition-colors",
              "hover:border-red-400 hover:bg-red-50/50",
              "disabled:cursor-not-allowed disabled:opacity-50",
              quoteResponse === "DECLINED"
                ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                : "border-border"
            )}
          >
            <XCircle
              className={cn(
                "mt-0.5 size-5 shrink-0",
                quoteResponse === "DECLINED"
                  ? "text-red-600"
                  : "text-muted-foreground"
              )}
            />

            <div className="space-y-1">
              <p className="text-sm font-semibold">
                Declined
              </p>

              <p className="text-xs leading-relaxed text-muted-foreground">
                The client has not approved the quotation.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Response notes */}
      <div className="space-y-2">
        <Label htmlFor="response-notes">
          Response notes
          <span className="ml-1 font-normal text-muted-foreground">
            (optional)
          </span>
        </Label>

        <Textarea
          id="response-notes"
          value={responseNotes}
          disabled={isPending}
          onChange={(event) =>
            setResponseNotes(event.target.value)
          }
          placeholder={
            quoteResponse === "DECLINED"
              ? "e.g. Client requested revised pricing or a different training date..."
              : quoteResponse === "ACCEPTED"
                ? "e.g. Client confirmed approval by email..."
                : "Add any relevant details about the client's response..."
          }
          rows={4}
          className="resize-none"
        />

        <p className="text-xs text-muted-foreground">
          Include any useful details from the client&apos;s
          communication.
        </p>
      </div>

      {/* Submission */}
      <div className="border-t pt-4">
        <Button
          type="button"
          size='lg'
          className="w-full"
          disabled={!quoteResponse || isPending}
          onClick={handleSubmit}
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Updating quotation...
            </>
          ) : (
            <>
              {quoteResponse === "ACCEPTED"
                ? "Confirm Acceptance"
                : quoteResponse === "DECLINED"
                  ? "Confirm Decline"
                  : "Select a Response"}

              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default BookingQuoteResponse;
