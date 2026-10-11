"use client";

import { useRouter } from "next/navigation";
import {
  FileText,
  ArrowLeft,
  Save,
  Send,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Quote, QuoteStatus } from "../types/quote";
import { QuoteStatusBadge } from "./quoteStatusBadge";

interface QuoteHeaderProps {
  quote?: Quote | null;
  isSaving: boolean;
  onSave: () => void;
  onStatusChange: (status: QuoteStatus) => void;
}

export function QuoteHeader({
  quote,
  isSaving,
  onSave,
  onStatusChange,
}: QuoteHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
      <div className="space-y-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-xs text-muted-foreground hover:text-foreground -ml-2 mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Booking
        </Button>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {quote ? `Quote Ref: ${quote.reference}` : "New Quotation"}
          </h1>
          <QuoteStatusBadge status={quote?.status} />
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          className="text-xs gap-1.5"
        >
          {isSaving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          Save Draft
        </Button>

        {quote?.status === "DRAFT" && (
          <Button
            size="sm"
            onClick={() => onStatusChange("SENT")}
            disabled={isSaving}
            className="text-xs gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Issue & Mark Sent
          </Button>
        )}

        {quote?.status === "SENT" && (
          <>
            <Button
              size="sm"
              className="text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => onStatusChange("ACCEPTED")}
              disabled={isSaving}
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Mark Accepted
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="text-xs gap-1.5 text-rose-600 hover:bg-rose-50 border-rose-200"
              onClick={() => onStatusChange("DECLINED")}
              disabled={isSaving}
            >
              <XCircle className="w-3.5 h-3.5" /> Mark Declined
            </Button>
          </>
        )}

        {(quote?.status === "ACCEPTED" || quote?.status === "DECLINED") && (
          <Button
            size="sm"
            variant="outline"
            className="text-xs gap-1.5"
            onClick={() => onStatusChange("DRAFT")}
            disabled={isSaving}
          >
            <RotateCcw className="w-3.5 h-3.5" /> Re-open as Draft
          </Button>
        )}
      </div>
    </div>
  );
}