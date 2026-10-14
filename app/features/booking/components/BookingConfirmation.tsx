import { CalendarClock, CheckCircle2, Mail, Phone } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { deliveryModeLabel, formatMoney } from "../lib/pricing";
import { ConfirmedBooking } from "../services/booking";

interface PriceEstimate{
  participants:number;
  currency:string;
  totalPrice:number;
  pricePerParticipant:number;
}

export function BookingConfirmation({ confirmation, estimate }: { confirmation: ConfirmedBooking, estimate: PriceEstimate | null }) {
  // Format preferred dates for display
  const formatDate = (d: string | Date | null | undefined) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const startDateFormatted = formatDate(confirmation.preferredStartDate);
  const endDateFormatted = formatDate(confirmation.preferredEndDate);

  const preferredDatesText = startDateFormatted
    ? endDateFormatted && startDateFormatted !== endDateFormatted
      ? `${startDateFormatted} → ${endDateFormatted}`
      : startDateFormatted
    : "Flexible";

  const totalAmount = estimate?.totalPrice;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-border bg-card p-6 text-center sm:p-10">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-8" />
        </span>
        
        <h1 className="mt-5 font-bold text-2xl sm:text-3xl tracking-tight">Request received</h1>
        
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          Thanks {confirmation.contactName.split(" ")[0]} — your booking request for{" "}
          <strong className="text-foreground">{confirmation.course.title}</strong> is pending review. Our team
          will confirm availability and pricing within the hour and reach out to <strong className="text-foreground">{confirmation.contactPhone}</strong>.
        </p>

        <div className="mt-6 inline-flex flex-col items-center rounded-xl border border-dashed border-primary/40 bg-accent/50 px-6 py-4">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            Your reference
          </span>
          <span className="mt-1 font-mono text-xl font-semibold tracking-wider text-primary">
            {confirmation.reference}
          </span>
        </div>

        <Separator className="my-6" />

        <dl className="grid gap-3 text-left text-sm sm:grid-cols-2">
          <Item label="Status" value={confirmation.status} />
          <Item label="Delivery" value={deliveryModeLabel(confirmation.deliveryMode)} />
          <Item label="Participants" value={`${confirmation.participantCount} Person(s)`} />
          <Item
            label="Estimated Total"
            value={
              totalAmount != null
                ? formatMoney(Number(totalAmount), confirmation.currency)
                : "To be confirmed"
            }
          />
          <Item
            label="Preferred Dates"
            value={preferredDatesText}
          />
          {confirmation.organizationName && (
            <Item label="Organization" value={confirmation.organizationName} />
          )}
        </dl>

        <div className="mt-8 space-y-2 text-left text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <Mail className="size-4 shrink-0 text-primary" /> A copy of this request is tied to {confirmation.contactEmail}
          </p>
          <p className="flex items-center gap-2">
            <Phone className="size-4 shrink-0 text-primary" /> We may call {confirmation.contactPhone} to confirm details
          </p>
          <p className="flex items-center gap-2">
            <CalendarClock className="size-4 shrink-0 text-primary" /> No payment is required until the booking is confirmed
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size='lg'>
            <Link href="/courses">Browse more courses</Link>
          </Button>
          {confirmation.profileId && (
            <Button asChild size='lg' variant="outline">
              <Link href="/my-bookings">View my bookings</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/60 px-3.5 py-2.5">
      <dt className="text-xs text-muted-foreground font-medium">{label}</dt>
      <dd className="mt-0.5 font-semibold text-foreground">{value}</dd>
    </div>
  );
}