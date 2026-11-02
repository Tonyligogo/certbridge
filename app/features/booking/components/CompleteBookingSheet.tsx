
"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileBadge2,
  GraduationCap,
  Loader2,
  MapPin,
  MessageSquareText,
  Users,
  Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AdminBookingDetailsResponse } from "../types/admin-booking";
import { useCompleteBooking } from "../hooks/use-booking";
import { toast } from "sonner";

type Money = string | number | null | undefined;

interface Props {
  booking: AdminBookingDetailsResponse;
  onClose: ()=>void;
}

const toNumber = (value: Money) => {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number : 0;
};

function formatDate(value: string | null) {
  if (!value) return "Not scheduled";

  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function formatRange(start: string | null, end: string | null) {
  if (!start && !end) return "Not scheduled";
  if (!start || !end) return formatDate(start ?? end);
  if (start === end) return formatDate(start);

  return `${formatDate(start)} – ${formatDate(end)}`;
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

function MoneyRow({
  label,
  value,
  currency,
  negative = false,
}: {
  label: string;
  value: number;
  currency: string;
  negative?: boolean;
}) {
  const formatted = new Intl.NumberFormat("en-KE", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(Math.abs(value));

  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold tabular-nums">
        {negative && value !== 0 ? "−" : ""}
        {currency} {formatted}
      </span>
    </div>
  );
}

export function CompleteBookingSheetContent({
  booking,
  onClose
}: Props) {
    const [currentTime] = useState(() => Date.now());

    const completeBooking = useCompleteBooking();


  const attendance = useMemo(() => {
    const total = booking.participants.length;
    const present = booking.participants.filter(
      (p) => p.attendanceMarkedAt && p.attended
    ).length;
    const absent = booking.participants.filter(
      (p) => p.attendanceMarkedAt && !p.attended
    ).length;
    const unmarked = booking.participants.filter(
      (p) => !p.attendanceMarkedAt
    ).length;
    const certificatesPending = booking.participants.filter(
      (p) => p.attendanceMarkedAt && p.attended && !p.certificateIssued
    ).length;
    const feedbackPending = booking.participants.filter(
      (p) => p.attendanceMarkedAt && p.attended && !p.feedbackSubmitted
    ).length;

    return {
      total,
      present,
      absent,
      unmarked,
      certificatesPending,
      feedbackPending,
      complete: total > 0 && unmarked === 0,
    };
  }, [booking.participants]);

  const finances = useMemo(() => {
    const confirmedTrainers = booking.trainers.filter(
      (item) => item.status === "CONFIRMED"
    );
    const confirmedVenues = booking.venues.filter(
      (item) => item.status === "CONFIRMED"
    );

    const trainerCost = confirmedTrainers.reduce(
      (sum, item) => sum + toNumber(item.agreedAmount),
      0
    );
    const venueCost = confirmedVenues.reduce(
      (sum, item) => sum + toNumber(item.agreedAmount),
      0
    );

    const revenue = booking.quote
      ? toNumber(booking.quote.subtotal)
      : null;

    const totalCosts = trainerCost + venueCost;
    const grossResult = revenue === null ? null : revenue - totalCosts;

    const paid = booking.invoices.reduce(
      (sum, invoice) =>
        sum +
        invoice.payments.reduce(
          (paymentSum, payment) =>
            paymentSum + toNumber(payment.amount),
          0
        ),
      0
    );

    return {
      revenue,
      tax: booking.quote ? toNumber(booking.quote.taxAmount) : null,
      total: booking.quote ? toNumber(booking.quote.totalAmount) : null,
      trainerCost,
      venueCost,
      totalCosts,
      grossResult,
      paid,
    };
  }, [booking]);
  

  const endDatePassed = useMemo(() => {
  if (!booking.scheduledEndDate) return false;

  const endDate = new Date(booking.scheduledEndDate);

  if (Number.isNaN(endDate.getTime())) return false;

  // Treat the scheduled end date as an inclusive calendar date.
  const endOfTraining = new Date(endDate);
  endOfTraining.setUTCHours(23, 59, 59, 999);

  return currentTime > endOfTraining.getTime();
}, [booking.scheduledEndDate, currentTime]);

  const canComplete =
    booking.status === "CONFIRMED" &&
    attendance.complete &&
    endDatePassed;

  const money = (amount: number) =>
    `${booking.currency} ${new Intl.NumberFormat("en-KE", {
      maximumFractionDigits: 2,
    }).format(Math.abs(amount))}`;

  const deliveryMode =
    {
      ONLINE: "Online training",
      CLIENT_SITE: "Client site",
      ARRANGED_VENUE: "Arranged venue",
    }[booking.deliveryMode] ?? booking.deliveryMode;

const handleComplete = async () => {
  if (!canComplete || completeBooking.isPending) return;

  try {
    const response = await completeBooking.mutateAsync(booking.id);

    toast.success(
      response.message ?? "Booking completed successfully."
    );

    onClose();
  } catch (error) {
    const apiError = error as {
      message?: string;
      errors?: Record<string, string[]>;
    };

    const validationMessage = apiError.errors?.completion?.[0];

    toast.error(
      validationMessage ??
        apiError.message ??
        "Failed to complete booking."
    );
  }
};

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
      {/* LEFT SIDEBAR */}
      <aside className="flex w-full shrink-0 flex-col border-b lg:w-[320px] lg:border-b-0 lg:border-r">
        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          <div className="space-y-2">
            <Badge variant="secondary">{booking.reference}</Badge>
            <h2 className="text-xl font-semibold tracking-tight">
              Complete booking
            </h2>
            <p className="text-sm text-muted-foreground">
              Review this training before marking it as delivered.
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Booking overview</h3>

            <Detail
              label="Client"
              value={booking.organizationName || booking.contactName}
            />
            <Detail
              label="Training dates"
              value={formatRange(
                booking.scheduledStartDate,
                booking.scheduledEndDate
              )}
            />
            <Detail label="Delivery" value={deliveryMode} />
            <Detail
              label="Location"
              value={
                [booking.locationCity, booking.locationCountry]
                  .filter(Boolean)
                  .join(", ") || "Not specified"
              }
            />
            <Detail
              label="Attendance"
              value={
                <span>
                  {attendance.present} present · {attendance.absent} absent
                </span>
              }
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold">Remaining tasks</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                These can be handled after completion.
              </p>
            </div>

            <div className="flex items-start gap-3 rounded-lg border bg-background p-3">
              <FileBadge2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Certificates</p>
                <p className="text-xs text-muted-foreground">
                  {attendance.certificatesPending} awaiting issuance
                </p>
              </div>
              {attendance.certificatesPending === 0 && (
                <CheckCircle2 className="size-4 text-emerald-600" />
              )}
            </div>

            <div className="flex items-start gap-3 rounded-lg border bg-background p-3">
              <MessageSquareText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Participant feedback</p>
                <p className="text-xs text-muted-foreground">
                  {attendance.feedbackPending} responses pending
                </p>
              </div>
              {attendance.feedbackPending === 0 && (
                <CheckCircle2 className="size-4 text-emerald-600" />
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3 border-t bg-background p-5">
          {!attendance.complete && (
            <p className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400">
              <AlertTriangle className="size-4 shrink-0" />
              Record attendance for all participants before completing.
            </p>
          )}

          {!endDatePassed && (
            <p className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400">
              <Clock3 className="size-4 shrink-0" />
              The scheduled training end date has not passed.
            </p>
          )}

          <Button
  className="w-full"
  size="lg"
  disabled={!canComplete || completeBooking.isPending}
  onClick={handleComplete}
>
  {completeBooking.isPending ? (
    <>
      <Loader2 className="mr-2 size-4 animate-spin" />
      Completing booking...
    </>
  ) : (
    <>
      <CheckCircle2 className="mr-2 size-4" />
      Mark as complete
    </>
  )}
</Button>

          <p className="text-center text-xs text-muted-foreground">
            Certificates and feedback remain accessible afterward.
          </p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="min-w-0 flex-1 space-y-6 overflow-y-auto p-5 lg:p-7">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Training summary</h2>
          <p className="text-sm text-muted-foreground">
            Course, delivery resources and financial performance.
          </p>
        </div>

        <section className="space-y-4 rounded-xl border p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <GraduationCap className="size-5 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold">{booking.course.title}</h3>
              <p className="text-sm text-muted-foreground">
                {booking.course.durationDays} days · {deliveryMode}
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="size-4 text-muted-foreground" />
              {formatRange(
                booking.scheduledStartDate,
                booking.scheduledEndDate
              )}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="size-4 text-muted-foreground" />
              {attendance.total} participants
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="size-4 text-muted-foreground" />
              {booking.locationCity || deliveryMode}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="size-4 text-emerald-600" />
              {attendance.present} attended
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-semibold">Training resources</h3>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border p-4">
              <p className="mb-3 text-xs font-medium text-muted-foreground">
                CONFIRMED TRAINERS
              </p>
              {booking.trainers
                .filter((t) => t.status === "CONFIRMED")
                .map((item) => (
                  <div key={item.id} className="mb-2 last:mb-0">
                    <p className="text-sm font-medium">
                      {item.trainer.firstName} {item.trainer.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {money(toNumber(item.agreedAmount))}
                    </p>
                  </div>
                ))}
              {!booking.trainers.some((t) => t.status === "CONFIRMED") && (
                <p className="text-sm text-muted-foreground">
                  No confirmed trainers
                </p>
              )}
            </div>

            <div className="rounded-xl border p-4">
              <p className="mb-3 text-xs font-medium text-muted-foreground">
                CONFIRMED VENUES
              </p>
              {booking.venues
                .filter((v) => v.status === "CONFIRMED")
                .map((item) => (
                  <div key={item.id} className="mb-2 last:mb-0">
                    <p className="text-sm font-medium">{item.venue.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {money(toNumber(item.agreedAmount))}
                    </p>
                  </div>
                ))}
              {!booking.venues.some((v) => v.status === "CONFIRMED") && (
                <p className="text-sm text-muted-foreground">
                  No confirmed venues
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-xl border p-5">
          <div className="flex items-center gap-2">
            <Wallet className="size-5 text-muted-foreground" />
            <h3 className="font-semibold">Financial breakdown</h3>
          </div>

          {finances.revenue !== null ? (
            <>
              <MoneyRow
                label="Course fee (excluding VAT)"
                value={finances.revenue}
                currency={booking.currency}
              />
              <MoneyRow
                label="VAT"
                value={finances.tax ?? 0}
                currency={booking.currency}
              />
              <Separator />
              <MoneyRow
                label="Client total"
                value={finances.total ?? 0}
                currency={booking.currency}
              />

              <Separator />

              <MoneyRow
                label="Trainer fees"
                value={finances.trainerCost}
                currency={booking.currency}
                negative
              />
              <MoneyRow
                label="Venue fees"
                value={finances.venueCost}
                currency={booking.currency}
                negative
              />

              <Separator />

              <MoneyRow
                label="Total direct costs"
                value={finances.totalCosts}
                currency={booking.currency}
              />

              <div
                className={`rounded-xl p-4 ${
                  (finances.grossResult ?? 0) < 0
                    ? "bg-red-50 dark:bg-red-950/20"
                    : "bg-emerald-50 dark:bg-emerald-950/20"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Estimated gross result
                    </p>
                    <p
                      className={`mt-1 text-2xl font-bold tabular-nums ${
                        (finances.grossResult ?? 0) < 0
                          ? "text-red-700 dark:text-red-400"
                          : "text-emerald-700 dark:text-emerald-400"
                      }`}
                    >
                      {(finances.grossResult ?? 0) < 0 ? "−" : ""}
                      {money(finances.grossResult ?? 0)}
                    </p>
                  </div>
                  {(finances.grossResult ?? 0) < 0 && (
                    <ArrowDownRight className="size-6 text-red-600" />
                  )}
                </div>
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground">
                Estimated result = quotation subtotal minus confirmed
                trainer and venue agreed fees. Other expenses and
                supplier taxes are not included.
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No quotation is available to calculate revenue and profit.
            </p>
          )}
        </section>

        <div className="flex items-center justify-between rounded-xl border p-4">
          <div>
            <p className="text-sm font-medium">Payments received</p>
            <p className="text-xs text-muted-foreground">
              Across recorded invoice payments
            </p>
          </div>
          <p className="font-semibold tabular-nums">
            {money(finances.paid)}
          </p>
        </div>
      </main>
    </div>
  );
}
