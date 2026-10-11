"use client";

import {
  Building2,
  Globe2,
  Mail,
  MapPin,
  Phone,
  UsersRound,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import type { AdminBookingDetailsResponse } from "../../types/admin-booking";
import { DetailRow, InfoBlock, Section } from "./TrainerDetailsSheet";
import { formatDate, formatEnum, formatMoney } from "../../utils/utils";

type VenueAssignment = AdminBookingDetailsResponse["venues"][number];

interface VenueDetailsSheetProps {
  assignment: VenueAssignment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VenueDetailsSheet({
  assignment,
  open,
  onOpenChange,
}: VenueDetailsSheetProps) {
  if (!assignment) return null;

  const { venue } = assignment;

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
    >
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-lg"
      >
        <SheetHeader className="border-b px-6 py-5 text-left">
          <SheetTitle>Venue Details</SheetTitle>

          <SheetDescription>
            Venue information and assignment details for
            this booking.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Venue heading */}
          <div className="px-6 py-6">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Building2 className="size-5 text-muted-foreground" />
              </div>

              <div className="min-w-0">
                <h3 className="text-base font-semibold">
                  {venue.name}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {[venue.city, venue.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </div>

            {venue.description && (
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {venue.description}
              </p>
            )}
          </div>

          <Separator />

          {/* Venue details */}
          <Section title="Venue information">
            <DetailRow
              icon={MapPin}
              label="Address"
              value={
                [
                  venue.address,
                  venue.city,
                  venue.country,
                ]
                  .filter(Boolean)
                  .join(", ") ||
                "Not provided"
              }
            />

            <DetailRow
              icon={UsersRound}
              label="Capacity"
              value={
                venue.capacity != null
                  ? `${venue.capacity} people`
                  : "Not provided"
              }
            />

            <DetailRow
              icon={Phone}
              label="Phone"
              value={
                venue.phone || "Not provided"
              }
            />

            <DetailRow
              icon={Mail}
              label="Email"
              value={
                venue.email || "Not provided"
              }
            />

            <DetailRow
              icon={Globe2}
              label="Website"
              value={
                venue.website || "Not provided"
              }
            />
          </Section>

          <Separator />

          {/* Assignment */}
          <Section title="Booking assignment">
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoBlock
                label="Assignment status"
                value={formatEnum(
                  assignment.status
                )}
              />

              <InfoBlock
                label="Agreed amount"
                value={formatMoney(
                  assignment.agreedAmount,
                  assignment.currency
                )}
              />

              <InfoBlock
                label="Confirmed"
                value={
                  assignment.confirmedAt
                    ? formatDate(
                        assignment.confirmedAt
                      )
                    : "Not confirmed"
                }
              />
            </div>

            {assignment.notes && (
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Assignment notes
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm">
                  {assignment.notes}
                </p>
              </div>
            )}
          </Section>
        </div>
      </SheetContent>
    </Sheet>
  );
}