"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  FileText,
  Loader2,
  Mail,
  RefreshCw,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import type { EnquiryQuote, UpdateEnquiryQuoteStatusInput } from "../../types";
import {
  useIssueEnquiryQuotation,
  useSendEnquiryQuotation,
  useUpdateEnquiryQuotationStatus,
  useVoidEnquiryQuotation,
} from "../../hooks/use-enquiry-quotations";
import { useEnquiryQuotePdf } from "../../hooks/use-enquiry-quote-pdf";

type Action = "send" | "accept" | "decline" | "void" | null;

interface Props {
  enquiryId: string;
  enquiryEmail: string;
  quote: EnquiryQuote;
  canManage: boolean;
  onBack: () => void;
  onEdit: (quoteId: string) => void;
}

const formatMoney = (value: string, code: string) => {
  const n = Number(value);
  return Number.isFinite(n)
    ? `${code} ${new Intl.NumberFormat("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)}`
    : `${code} ${value}`;
};
const formatDate = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat("en-KE", {
        dateStyle: "medium",
        timeZone: "Africa/Nairobi",
      }).format(new Date(value))
    : "—";
const statusName = (status: string) =>
  status.charAt(0) + status.slice(1).toLowerCase().replaceAll("_", " ");

export function EnquiryQuotationDetails({
  enquiryId,
  enquiryEmail,
  quote,
  canManage,
  onBack,
  onEdit,
}: Props) {
  const [action, setAction] = useState<Action>(null);
  const [email, setEmail] = useState(enquiryEmail);
  const [resend, setResend] = useState(false);
  const [notes, setNotes] = useState("");
  const [reason, setReason] = useState("");

  const { viewPdf, downloadPdf, isLoading:openingPdf } = useEnquiryQuotePdf(enquiryId, quote.id);
  const issue = useIssueEnquiryQuotation(enquiryId);
  const send = useSendEnquiryQuotation(enquiryId, quote.id);
  const updateStatus = useUpdateEnquiryQuotationStatus(enquiryId, quote.id);
  const voidQuote = useVoidEnquiryQuotation(enquiryId, quote.id);
  const busy =
    issue.isPending ||
    send.isPending ||
    updateStatus.isPending ||
    voidQuote.isPending ||
    openingPdf;
  const claimed = Boolean(quote.issueToken);
  const canAct = canManage && !claimed;
  const hasPdf = Boolean(quote.pdfPath);
  const emailPending = quote.emailStatus === "PENDING";
  const sendable =
    canAct &&
    hasPdf &&
    !emailPending &&
    (quote.status === "ISSUED" || quote.status === "SENT");
  const canRespond =
    canAct && quote.status === "SENT" && quote.emailStatus === "SENT";
  const canVoid =
    canAct &&
    !emailPending &&
    ["DRAFT", "ISSUED", "SENT"].includes(quote.status);

  const handleIssue = async () => {
    try {
      await issue.mutateAsync(quote.id);
      toast.success("Quotation issued");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to issue quotation",
      );
    }
  };

  const submitAction = async () => {
    try {
      if (action === "send") {
        if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
          toast.error("Enter a valid recipient email");
          return;
        }
        const input = { email: email.trim(), resend };
        await send.mutateAsync(input);
        toast.success(resend ? "Quotation resent" : "Quotation sent");
      } else if (action === "accept" || action === "decline") {
        const input: UpdateEnquiryQuoteStatusInput = {
          status: action === "accept" ? "ACCEPTED" : "DECLINED",
          responseNotes: notes.trim() || null,
        };
        await updateStatus.mutateAsync(input);
        toast.success(
          action === "accept"
            ? "Quotation marked as accepted"
            : "Quotation marked as declined",
        );
      } else if (action === "void") {
        if (reason.trim().length < 5) {
          toast.error("Enter a reason of at least 5 characters");
          return;
        }
        const input = { reason: reason.trim() };
        await voidQuote.mutateAsync(input);
        toast.success("Quotation voided");
      }
      setAction(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Action failed. Please try again.",
      );
    }
  };

  return (
    <div className="space-y-5 px-5 py-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label="Back to quotations"
          onClick={onBack}
          disabled={busy}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold">
            {quote.reference}
          </h3>
          <p className="text-xs text-muted-foreground">Quotation details</p>
        </div>
        <Badge variant="secondary">{statusName(quote.status)}</Badge>
      </div>

      <section className="rounded-xl border bg-card p-4">
        <p className="text-xs text-muted-foreground">Quotation total</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">
          {formatMoney(quote.totalAmount, quote.currency)}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Created</p>
            <p className="mt-1 font-medium">{formatDate(quote.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Issued</p>
            <p className="mt-1 font-medium">{formatDate(quote.issuedAt)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Expires</p>
            <p className="mt-1 font-medium">{formatDate(quote.expiresAt)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Sent</p>
            <p className="mt-1 font-medium">{formatDate(quote.sentAt)}</p>
          </div>
        </div>
        {quote.sentTo && (
          <p className="mt-4 break-all text-xs text-muted-foreground">
            Last sent to {quote.sentTo}
          </p>
        )}
        {hasPdf && (
          <div className="flex gap-5 mt-6">
            <Button
              type="button"
              size='lg'
              className="flex-1"
              variant="outline"
              onClick={viewPdf}
              disabled={busy}
            >
              {openingPdf ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ExternalLink className="size-4" />
              )}
              View quotation PDF
            </Button>
            <Button
              type="button"
              size='lg'
              className="flex-1"
              variant="outline"
              onClick={downloadPdf}
              disabled={busy}
            >
              {openingPdf ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ExternalLink className="size-4" />
              )}
              Download quotation PDF
            </Button>
          </div>
        )}
      </section>

      {claimed && (
        <div className="flex items-start gap-2 rounded-lg border p-3 text-sm">
          <RefreshCw className="mt-0.5 size-4 shrink-0" />
          Quotation issuance is being processed. Refresh the list before taking
          further action.
        </div>
      )}
      {emailPending && (
        <div className="flex items-start gap-2 rounded-lg border p-3 text-sm">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          Email delivery is pending or requires reconciliation. Sending is
          temporarily unavailable.
        </div>
      )}

      <section className="space-y-3">
        <h4 className="text-sm font-semibold">Line items</h4>
        <div className="divide-y rounded-xl border">
          {quote.items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-3 p-3 text-sm"
            >
              <div className="min-w-0">
                <p className="wrap-break-word font-medium">{item.name}</p>
                {Number(item.quantity) !== 1 && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                )}
              </div>
              <p className="shrink-0 font-medium tabular-nums">
                {formatMoney(item.amount, quote.currency)}
              </p>
            </div>
          ))}
        </div>
        <div className="space-y-2 rounded-xl bg-muted/40 p-4 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="tabular-nums">
              {formatMoney(quote.subtotal, quote.currency)}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">
              Tax ({statusName(quote.taxType)})
            </span>
            <span className="tabular-nums">
              {formatMoney(quote.taxAmount, quote.currency)}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between gap-3 font-semibold">
            <span>Total</span>
            <span className="tabular-nums">
              {formatMoney(quote.totalAmount, quote.currency)}
            </span>
          </div>
        </div>
      </section>

      {(quote.responseNotes || quote.acceptedAt || quote.declinedAt) && (
        <section className="space-y-2 rounded-xl border p-4 text-sm">
          <h4 className="font-semibold">Customer response</h4>
          {quote.acceptedAt && (
            <p className="text-muted-foreground">
              Accepted {formatDate(quote.acceptedAt)}
            </p>
          )}
          {quote.declinedAt && (
            <p className="text-muted-foreground">
              Declined {formatDate(quote.declinedAt)}
            </p>
          )}
          {quote.responseNotes && (
            <p className="whitespace-pre-wrap wrap-break-word">
              {quote.responseNotes}
            </p>
          )}
        </section>
      )}

      {canAct && (
        <section className="space-y-3">
          <h4 className="text-sm font-semibold">Actions</h4>
          <div className="flex flex-wrap gap-2">
            {quote.status === "DRAFT" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busy}
                  onClick={() => onEdit(quote.id)}
                >
                  <FileText className="size-4" /> Edit draft
                </Button>
                <Button
                  size="sm"
                  disabled={busy}
                  onClick={() => void handleIssue()}
                >
                  {issue.isPending && (
                    <Loader2 className="size-4 animate-spin" />
                  )}{" "}
                  Issue quotation
                </Button>
              </>
            )}
            {sendable && (
              <Button
                size="sm"
                disabled={busy}
                onClick={() => {
                  setResend(quote.emailStatus === "SENT");
                  setEmail(quote.sentTo || enquiryEmail);
                  setAction("send");
                }}
              >
                <Mail className="size-4" />{" "}
                {quote.emailStatus === "SENT" ? "Resend" : "Send quotation"}
              </Button>
            )}
            {canRespond && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busy}
                  onClick={() => {
                    setNotes("");
                    setAction("accept");
                  }}
                >
                  <CheckCircle2 className="size-4" /> Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busy}
                  onClick={() => {
                    setNotes("");
                    setAction("decline");
                  }}
                >
                  <XCircle className="size-4" /> Decline
                </Button>
              </>
            )}
            {canVoid && (
              <Button
                size="sm"
                variant="outline"
                disabled={busy}
                className="text-destructive"
                onClick={() => {
                  setReason("");
                  setAction("void");
                }}
              >
                <ShieldAlert className="size-4" /> Void
              </Button>
            )}
          </div>
        </section>
      )}

      {action && (
        <section
          className="space-y-4 rounded-xl border bg-muted/20 p-4"
          aria-label="Quotation action confirmation"
        >
          <div>
            <h4 className="text-sm font-semibold">
              {action === "send"
                ? resend
                  ? "Resend quotation"
                  : "Send quotation"
                : action === "accept"
                  ? "Record acceptance"
                  : action === "decline"
                    ? "Record decline"
                    : "Void quotation"}
            </h4>
            <p className="mt-1 text-xs text-muted-foreground">
              {action === "send"
                ? "Confirm the email recipient before sending the issued PDF."
                : action === "void"
                  ? "Voiding cannot be undone. Provide a reason for the audit trail."
                  : "Record the customer's decision. This cannot be edited using this screen."}
            </p>
          </div>
          {action === "send" ? (
            <div className="space-y-1.5">
              <Label htmlFor="quote-send-email">Recipient email</Label>
              <Input
                id="quote-send-email"
                type="email"
                value={email}
                disabled={busy}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          ) : action === "void" ? (
            <div className="space-y-1.5">
              <Label htmlFor="quote-void-reason">Reason</Label>
              <Textarea
                id="quote-void-reason"
                value={reason}
                maxLength={1000}
                disabled={busy}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label htmlFor="quote-response-notes">
                Response notes (optional)
              </Label>
              <Textarea
                id="quote-response-notes"
                value={notes}
                disabled={busy}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => setAction(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={busy}
              onClick={() => void submitAction()}
            >
              {busy && <Loader2 className="size-4 animate-spin" />} Confirm{" "}
              {action === "send"
                ? "send"
                : action === "accept"
                  ? "acceptance"
                  : action === "decline"
                    ? "decline"
                    : "void"}
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
