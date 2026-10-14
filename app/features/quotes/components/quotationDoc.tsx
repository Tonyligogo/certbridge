import { cn } from "@/lib/utils";
import {
  Building2,
  CalendarDays,
  Loader2,
  MapPin,
  Monitor,
  Pencil,
  Send,
  Users,
} from "lucide-react";
import { DeliveryMode } from "../../booking/types";
import { COMPANY_CONFIG, Quote } from "../types/quote";
import { AdminBookingDetailsResponse } from "../../booking/types/admin-booking";
import { Button } from "@/components/ui/button";
import { useUpdateQuoteStatus } from "../hooks/use-quote";
import { formatMoney } from "../../booking/utils/utils";

export interface QuotationDocumentProps {
  quote: Quote;
  booking: AdminBookingDetailsResponse;
  onRevise: ()=>void;
  onSent:()=>void;
  invoiceDueDate?: string;
  invoiceNotes?: string;
  isInvoice?:boolean;
}

function formatShortDate(date: string | null): string {
  if (!date) return "N/A";
  return new Intl.DateTimeFormat("en-KE", {
    day:   "numeric",
    month: "short",
    year:  "numeric",
  }).format(new Date(date));
}

function formatPhone(phone: string): string {
  // Normalise 07xx → +254 7xx
  const cleaned = phone.replace(/\s/g, "");
  if (cleaned.startsWith("0")) return `+254 ${cleaned.slice(1)}`;
  return phone;
}

// ── Sub-components ────────────────────────────────────────────────────────────

// Delivery mode label + icon
const DELIVERY_LABELS: Record<DeliveryMode, { label: string; icon: React.ReactNode }> = {
  ONLINE:       { label: "Online",        icon: <Monitor  className="h-3 w-3" /> },
  ARRANGED_VENUE:    { label: "Our Venue",     icon: <MapPin   className="h-3 w-3" /> },
  CLIENT_SITE: { label: "Client Venue",  icon: <MapPin   className="h-3 w-3" /> },
};

function DeliveryBadge({ mode }: { mode: DeliveryMode }) {
  const { label, icon } = DELIVERY_LABELS[mode] ?? {
    label: mode,
    icon: <MapPin className="h-3 w-3" />,
  };
  return (
    <span className="inline-flex items-center gap-1.5 rounded-sm bg-blue-600 px-2.5 py-0.5 text-[10.5px] font-bold tracking-wide text-white">
      {icon}{label}
    </span>
  );
}

// Section label with rule
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="text-[9.5px] font-bold uppercase tracking-[0.9px] text-slate-400">
        {children}
      </span>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

// Party column in the parties strip
function PartyColumn({
  role,
  children,
  className,
}: {
  role: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-8 py-7", className)}>
      <div className="mb-3">
        <span className="text-xs font-bold uppercase tracking-[1.1px] text-primary">
          {role}
        </span>
      </div>
      {children}
    </div>
  );
}

// Compact info row used inside party columns
function PRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex gap-0 py-[3px] text-[12px] leading-relaxed">
      <span className="w-[76px] shrink-0 text-slate-400">{label}</span>
      <span className="font-medium text-slate-700">{value}</span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function QuotationDocument({
  quote,
  booking,
  onRevise,
  onSent,
  invoiceDueDate,
  invoiceNotes,
  isInvoice = false,
}: QuotationDocumentProps) {
  const co = COMPANY_CONFIG;

  const {
    mutate: sendQuote,
    isPending: isSending,
  } = useUpdateQuoteStatus();

  if (!booking) {
    return (
      <div>
        <p>There is no booking related to this quote</p>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Document identity
  // ─────────────────────────────────────────────────────────────

  const documentTitle = isInvoice ? "Invoice" : "Quotation";

  const clientName =
    booking.organizationName ?? booking.contactName;

  const currency = quote.currency;

  const issuedDate = quote.issuedAt
    ? new Date(quote.issuedAt)
    : null;

  // ─────────────────────────────────────────────────────────────
  // Quote / Invoice date notice
  // ─────────────────────────────────────────────────────────────

  const dateNotice = isInvoice
    ? invoiceDueDate
      ? `Payment due ${formatShortDate(invoiceDueDate)}`
      : null
    : quote.expiresAt
      ? `Valid until ${formatShortDate(quote.expiresAt)}`
      : null;

  // ─────────────────────────────────────────────────────────────
  // Training dates
  // Prefer scheduled dates, fall back to preferred dates
  // ─────────────────────────────────────────────────────────────

  const startDate =
    booking.scheduledStartDate ??
    booking.preferredStartDate;

  const endDate =
    booking.scheduledEndDate ??
    booking.preferredEndDate;

  const dateLabel = booking.scheduledStartDate
    ? ""
    : " (preferred)";

  // ─────────────────────────────────────────────────────────────
  // Location
  // ─────────────────────────────────────────────────────────────

  const locationParts = [
    booking.locationAddress,
    booking.locationCity,
    booking.locationCountry,
  ].filter(Boolean);

  const locationLine =
    locationParts.join(", ") || null;

  // ─────────────────────────────────────────────────────────────
  // Financial snapshot
  //
  // IMPORTANT:
  // These values are calculated and persisted by the backend.
  // This document only displays them.
  // ─────────────────────────────────────────────────────────────

  const subtotal = Number(quote.subtotal);
  const taxRate = Number(quote.taxRate);
  const taxAmount = Number(quote.taxAmount);
  const totalAmount = Number(quote.totalAmount);

  const taxLabel = (() => {
    switch (quote.taxType) {
      case "STANDARD":
        return `VAT (${taxRate}%)`;

      case "ZERO_RATED":
        return "VAT (Zero-rated)";

      case "EXEMPT":
        return "VAT (Exempt)";

      case "NONE":
        return "Tax";

      default:
        return "Tax";
    }
  })();

  // ─────────────────────────────────────────────────────────────
  // Quote actions
  // ─────────────────────────────────────────────────────────────

  const handleSend = () => {
    sendQuote(
      {
        bookingId: booking.id,
        data: {
          status: "SENT",
        },
      },
      {
        onSuccess: () => {
          onSent();
        },
      }
    );
  };

  return (
    <div className="m-4 space-y-4">
      <div className="overflow-hidden border bg-white">

        {/* ═══════════════════════════════════════════════════════
            HEADER
        ═══════════════════════════════════════════════════════ */}

        <div className="flex items-start justify-between gap-6 bg-primary p-8">

          {/* Logo */}
          <a href="#">
            <div className="group flex cursor-pointer items-center gap-3">
              <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white font-black tracking-tighter">
                <span className="z-10 text-xs text-black">
                  C
                </span>

                <span className="z-10 -ml-0.5 text-xs text-blue-400">
                  B
                </span>
              </div>

              <span className="text-2xl font-bold tracking-tight text-white">
                CertBridge

                <span className="ml-1 text-lg font-medium text-gray-200">
                  Global
                </span>
              </span>
            </div>
          </a>

          {/* Document heading */}
          <div className="text-right">
            <div className="mt-1 text-[30px] font-extrabold leading-none tracking-tight text-white">
              {documentTitle}
            </div>

            <div className="mt-2 text-[12.5px] leading-relaxed text-white">
              Ref:{" "}
              <span className="font-semibold text-white">
                {quote.reference}
              </span>

              <br />

              {!isInvoice && issuedDate ? (
                <span>
                  <span>Issued at: </span>

                  <span className="font-semibold text-white">
                    {issuedDate.toLocaleDateString()}
                  </span>
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            PARTIES
        ═══════════════════════════════════════════════════════ */}

        <div className="grid grid-cols-1 sm:grid-cols-2">

          {/* Billed To */}
          <PartyColumn role="Billed To:">
            <div className="mb-2 font-bold leading-snug text-slate-900">
              {clientName}
            </div>

            <PRow
              label="Contact"
              value={booking.contactName}
            />

            <PRow
              label="Email"
              value={booking.contactEmail}
            />

            <PRow
              label="Phone"
              value={formatPhone(booking.contactPhone)}
            />

            {locationLine && (
              <PRow
                label="Location"
                value={locationLine}
              />
            )}
          </PartyColumn>

          {/* Issued By */}
          <PartyColumn
            role="Issued By:"
            className="sm:justify-self-end"
          >
            <div className="mb-2 font-bold leading-snug text-slate-900">
              {co.name}
            </div>

            <PRow
              label="Email"
              value={co.email}
            />

            <PRow
              label="Phone"
              value={co.phone}
            />

            <PRow
              label="Website"
              value={co.website}
            />
          </PartyColumn>
        </div>

        {/* ═══════════════════════════════════════════════════════
            DATE / VALIDITY NOTICE
        ═══════════════════════════════════════════════════════ */}

        {dateNotice ? (
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-12 py-2.5 text-[12px]">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />

            <span>
              {dateNotice} —{" "}

              <strong className="font-semibold">
                {isInvoice
                  ? "please make payment by the due date."
                  : "please confirm acceptance before this date to secure your preferred training dates."}
              </strong>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 border-x border-primary bg-primary px-12 py-2.5 text-[12px] text-white">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />

            <span>
              <strong className="font-medium text-white">
                {isInvoice
                  ? "Please use the invoice reference when making payment."
                  : "Please confirm acceptance at your earliest convenience to secure your preferred dates."}
              </strong>
            </span>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            BODY
        ═══════════════════════════════════════════════════════ */}

        <div className="px-8 py-10">

          {/* ─────────────────────────────────────────────────────
              Training overview
          ───────────────────────────────────────────────────── */}

          <SectionLabel>
            Training Overview
          </SectionLabel>

          <div className="mb-7 grid grid-cols-1 gap-4 rounded-sm border border-blue-100 border-l-4 border-l-blue-600 bg-accent p-5 sm:grid-cols-[1fr_auto]">

            <div>
              <div className="mb-2 text-[16px] font-bold leading-snug tracking-tight text-slate-900">
                {booking.course.title}
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12px] text-slate-500">

                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3 w-3" />

                  {formatShortDate(startDate)} –{" "}
                  {formatShortDate(endDate)}

                  {dateLabel && (
                    <span className="italic text-slate-400">
                      {dateLabel}
                    </span>
                  )}
                </span>

                {locationLine && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3" />
                    {locationLine}
                  </span>
                )}

                <span className="flex items-center gap-1.5">
                  <Users className="h-3 w-3" />

                  {booking.participantCount}{" "}
                  {booking.participantCount === 1
                    ? "participant"
                    : "participants"}
                </span>

                {booking.organizationName && (
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-3 w-3" />
                    {booking.organizationName}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-start gap-2 sm:items-end">
              <DeliveryBadge
                mode={
                  booking.deliveryMode as DeliveryMode
                }
              />

              <span className="text-[11px] text-slate-400">
                Booking {booking.reference}
              </span>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────
              Line items
          ───────────────────────────────────────────────────── */}

          <SectionLabel>
            Line Items
          </SectionLabel>

          <table className="mb-1 w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-900">

                <th className="pb-2.5 text-left text-[10px] font-bold uppercase tracking-[0.7px] text-slate-400">
                  Description
                </th>

                <th className="px-3 pb-2.5 text-center text-[10px] font-bold uppercase tracking-[0.7px] text-slate-400">
                  Qty
                </th>

                <th className="px-3 pb-2.5 text-right text-[10px] font-bold uppercase tracking-[0.7px] text-slate-400">
                  Unit Price
                </th>

                <th className="pb-2.5 text-right text-[10px] font-bold uppercase tracking-[0.7px] text-slate-400">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {quote.items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b"
                >
                  <td className="py-3.5 align-top">
                    <div className="text-[13.5px] font-semibold text-slate-900">
                      {item.name}
                    </div>
                  </td>

                  <td className="px-3 py-3.5 text-center align-middle text-[13px] tabular-nums text-slate-500">
                    {parseInt(
                      item.quantity,
                      10
                    )}
                  </td>

                  <td className="px-3 py-3.5 text-right align-middle text-[13px] tabular-nums text-slate-600">
                    {formatMoney(
                      Number(item.unitPrice),
                      currency
                    )}
                  </td>

                  <td className="py-3.5 text-right align-middle text-[13.5px] font-semibold tabular-nums text-slate-900">
                    {formatMoney(
                      Number(item.amount),
                      currency
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ─────────────────────────────────────────────────────
              Totals
          ───────────────────────────────────────────────────── */}

          <div className="mb-8 flex justify-end pt-5">
            <div className="w-full max-w-75 space-y-1.5">

              {/* Subtotal */}
              <div className="flex justify-between text-[13px]">
                <span className="text-slate-400">
                  Subtotal
                </span>

                <span className="tabular-nums font-medium text-slate-700">
                  {formatMoney(
                    subtotal,
                    currency
                  )}
                </span>
              </div>

              {/* Tax */}
              {quote.taxType !== "NONE" && (
                <div className="flex justify-between text-[13px]">
                  <span className="text-slate-400">
                    {taxLabel}
                  </span>

                  <span className="tabular-nums font-medium text-slate-700">
                    {formatMoney(
                      taxAmount,
                      currency
                    )}
                  </span>
                </div>
              )}

              {/* Grand total */}
              <div className="mt-2 flex items-center justify-between rounded-sm bg-primary px-4 py-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.5px] text-white/70">
                  {isInvoice
                    ? "Amount Due"
                    : "Total"}
                </span>

                <span className="text-[19px] font-extrabold tabular-nums tracking-tight text-white">
                  {formatMoney(
                    totalAmount,
                    currency
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────
              Payment instructions
              Only shown for invoices
          ───────────────────────────────────────────────────── */}

          {isInvoice && (
            <div className="mb-7 rounded border p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-sm font-bold uppercase tracking-[1px]">
                  Payment Instructions
                </span>
              </div>

              <div>
                {[
                  {
                    k: "Bank",
                    v: co.bankName,
                  },
                  {
                    k: "Account Name",
                    v: co.accountName,
                  },
                  {
                    k: "Account No.",
                    v: co.accountNo,
                  },
                  {
                    k: "Branch",
                    v: co.branch,
                  },
                  {
                    k: "M-Pesa Paybill",
                    v: co.paybill,
                  },
                  {
                    k: "Payment Reference",
                    v: quote.reference,
                  },
                ].map(({ k, v }) => (
                  <div
                    key={k}
                    className="flex items-center justify-between gap-3 border-b border-slate-100 py-2 last:border-none"
                  >
                    <span className="mb-1 text-xs">
                      {k}:
                    </span>

                    <span className="text-[13px] font-semibold text-slate-900">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────
              Notes + Terms
          ───────────────────────────────────────────────────── */}

          <div className="space-y-7">

            {/* Notes */}
            <div className="rounded-sm border border-slate-200 p-5">
              <h4 className="mb-3 text-[9.5px] font-bold uppercase tracking-[1px] text-slate-400">
                {isInvoice
                  ? "Invoice Notes"
                  : "Quotation Notes"}
              </h4>

              {isInvoice ? (
                invoiceNotes ? (
                  <p className="text-[12.5px] leading-relaxed text-slate-600">
                    {invoiceNotes}
                  </p>
                ) : (
                  <p className="text-[12.5px] italic leading-relaxed text-slate-400">
                    No additional invoice notes.
                  </p>
                )
              ) : (
                <p className="text-[12.5px] leading-relaxed text-slate-600">
                  This quotation is prepared for{" "}
                  <strong className="font-semibold text-slate-800">
                    {clientName}
                  </strong>{" "}
                  following their booking request for{" "}
                  <strong className="font-semibold text-slate-800">
                    {booking.course.title}
                  </strong>
                  . The quoted total of{" "}
                  <strong className="font-semibold text-slate-800">
                    {formatMoney(
                      totalAmount,
                      currency
                    )}
                  </strong>{" "}
                  reflects the proposed amount for the
                  training request. Please reference{" "}
                  <strong className="font-semibold text-slate-800">
                    {quote.reference}
                  </strong>{" "}
                  in any communication regarding this
                  quotation.
                </p>
              )}

              {booking.specialRequirements && (
                <p className="mt-3 text-[12.5px] leading-relaxed text-slate-600">
                  <strong className="font-semibold">
                    Special requirements:{" "}
                  </strong>

                  {booking.specialRequirements}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="rounded-sm border border-slate-200 p-5">
              <h4 className="mb-3 text-[9.5px] font-bold uppercase tracking-[1px] text-slate-400">
                Terms &amp; Conditions
              </h4>

              <ul className="space-y-1.5 pl-4 text-[12.5px] leading-relaxed text-slate-600 marker:text-blue-500">
                {isInvoice ? (
                  <>
                    <li>
                      Payment should be made by the
                      invoice due date.
                    </li>

                    <li>
                      Please use the invoice reference
                      when making payment.
                    </li>

                    <li>
                      Contact us if you have any
                      questions regarding this invoice.
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      This quotation is subject to
                      client acceptance.
                    </li>

                    <li>
                      Pricing is valid until the
                      quotation expiry date.
                    </li>

                    <li>
                      Training dates remain subject to
                      availability until confirmed.
                    </li>

                    <li>
                      Changes to the training scope may
                      require a revised quotation.
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            FOOTER
        ═══════════════════════════════════════════════════════ */}

        <div className="flex justify-center pb-7">
          <div className="text-[11px] leading-relaxed text-gray-500">
            {co.email} · {co.phone} · {co.website}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          QUOTE ACTIONS

          Invoice actions belong to the invoice workflow,
          not to this quotation document.
      ═══════════════════════════════════════════════════════ */}

      {!isInvoice && booking.quote?.status === 'DRAFT' && (
        <div className="flex items-center justify-end gap-2">
          <Button
            size="lg"
            variant="outline"
            onClick={onRevise}
            disabled={isSending}
          >
            <Pencil className="size-4" />
            Revise
          </Button>

          <Button
            size="lg"
            onClick={handleSend}
            disabled={isSending}
          >
            {isSending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="size-4" />
                Send Quote
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default QuotationDocument;