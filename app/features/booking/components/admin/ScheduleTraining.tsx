"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  MapPin,
  Monitor,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import type { AdminBookingDetailsResponse } from "../../types/admin-booking";
import { useScheduleTraining } from "../../hooks/use-booking";

interface ScheduleTrainingProps {
  booking: AdminBookingDetailsResponse;
  onClose: () => void;
}

export function ScheduleTraining({
  booking,
  onClose,
}: ScheduleTrainingProps) {
  const scheduleTraining = useScheduleTraining();

  const isRescheduling = Boolean(
    booking.scheduledStartDate &&
      booking.scheduledEndDate
  );

  const [startDate, setStartDate] = useState(
    toDateInputValue(booking.scheduledStartDate?.toString())
  );

  const [endDate, setEndDate] = useState(
    toDateInputValue(booking.scheduledEndDate?.toString())
  );

  const confirmedTrainers = useMemo(
    () =>
      booking.trainers.filter(
        ({ status }) => status === "CONFIRMED"
      ),
    [booking.trainers]
  );

  const confirmedVenues = useMemo(
    () =>
      booking.venues.filter(
        ({ status }) => status === "CONFIRMED"
      ),
    [booking.venues]
  );

  const canSubmit =
    Boolean(startDate) &&
    Boolean(endDate) &&
    endDate >= startDate &&
    !scheduleTraining.isPending;

  async function handleSubmit() {
    if (!startDate || !endDate) {
      toast.error(
        "Please select the training start and end dates."
      );
      return;
    }

    if (endDate < startDate) {
      toast.error(
        "The training end date cannot be before the start date."
      );
      return;
    }

    try {
      const response =
        await scheduleTraining.mutateAsync({
          bookingId: booking.id,

          data: {
            scheduledStartDate:startDate,
            //   dateInputToString(),

            scheduledEndDate:endDate
            //   dateInputToString(endDate),
          },
        });

      if (!response.success) {
        toast.error(
          response.message ||
            "Failed to schedule training."
        );
        return;
      }

      toast.success(
        isRescheduling
          ? "Training rescheduled successfully."
          : "Training scheduled successfully."
      );

      onClose();
    } catch (error) {
      console.error(
        "Failed to schedule training:",
        error
      );

      toast.error(
        "Failed to schedule training. Please try again."
      );
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1 space-y-6 px-6 py-6">
        {/* Requested dates */}
        <section className="space-y-3">
          <div>
            <h3 className="text-sm font-medium">
              Requested dates
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Dates originally requested by the client.
            </p>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 size-4 text-muted-foreground" />

              <div className="min-w-0">
                <p className="text-sm font-medium">
                  {formatDateRange(
                    booking.preferredStartDate?.toString(),
                    booking.preferredEndDate?.toString()
                  )}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Preferred training period
                </p>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Schedule */}
        <section className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">
              {isRescheduling
                ? "Update training dates"
                : "Training dates"}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {isRescheduling
                ? "Change the confirmed dates for this training."
                : "Set the confirmed dates for this training."}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="scheduled-start-date">
                Start date
              </Label>

              <Input
                id="scheduled-start-date"
                type="date"
                value={startDate}
                onChange={(event) => {
                  const value = event.target.value;

                  setStartDate(value);

                  if (
                    endDate &&
                    value &&
                    endDate < value
                  ) {
                    setEndDate(value);
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduled-end-date">
                End date
              </Label>

              <Input
                id="scheduled-end-date"
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(event) =>
                  setEndDate(event.target.value)
                }
              />
            </div>
          </div>

          {isRescheduling && (
            <p className="text-xs text-muted-foreground">
              Updating these dates will be recorded as a
              reschedule in the booking activity.
            </p>
          )}
        </section>

        <Separator />

        {/* Delivery */}
        <section className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">
              Delivery details
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Confirm the resources associated with this
              training.
            </p>
          </div>

          <div className="space-y-3">
            <DeliveryModeRow booking={booking} />

            {confirmedTrainers.map(
              ({ id, role, trainer }) => (
                <div
                  key={id}
                  className="flex items-start gap-3 rounded-lg border p-4"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <UserRound className="size-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">
                        {trainer.firstName}{" "}
                        {trainer.lastName}
                      </p>

                      <CheckCircle2 className="size-4 shrink-0 text-green-600" />
                    </div>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatTrainerRole(role)}
                    </p>
                  </div>
                </div>
              )
            )}

            {booking.deliveryMode ===
              "ARRANGED_VENUE" &&
              confirmedVenues.map(
                ({ id, venue }) => (
                  <div
                    key={id}
                    className="flex items-start gap-3 rounded-lg border p-4"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      <MapPin className="size-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium">
                          {venue.name}
                        </p>

                        <CheckCircle2 className="size-4 shrink-0 text-green-600" />
                      </div>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {[venue.city, venue.country]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                )
              )}
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 flex shrink-0 items-center justify-end gap-3 border-t bg-background px-6 py-4">
        <Button
          type="button"
          variant="outline"
          disabled={scheduleTraining.isPending}
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          type="button"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          {scheduleTraining.isPending
            ? isRescheduling
              ? "Updating..."
              : "Scheduling..."
            : isRescheduling
              ? "Update schedule"
              : "Schedule training"}
        </Button>
      </div>
    </div>
  );
}

function DeliveryModeRow({
  booking,
}: {
  booking: AdminBookingDetailsResponse;
}) {
  if (booking.deliveryMode === "ONLINE") {
    return (
      <div className="flex items-start gap-3 rounded-lg border p-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
          <Monitor className="size-4" />
        </div>

        <div>
          <p className="text-sm font-medium">
            Online training
          </p>

          <p className="mt-0.5 text-xs text-muted-foreground">
            Delivered remotely
          </p>
        </div>
      </div>
    );
  }

  if (booking.deliveryMode === "CLIENT_SITE") {
    return (
      <div className="flex items-start gap-3 rounded-lg border p-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
          <MapPin className="size-4" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium">
            Client site
          </p>

          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatClientLocation(booking)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-lg border p-4">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
        <MapPin className="size-4" />
      </div>

      <div>
        <p className="text-sm font-medium">
          Arranged venue
        </p>

        <p className="mt-0.5 text-xs text-muted-foreground">
          Venue arranged by CertBridge
        </p>
      </div>
    </div>
  );
}

function toDateInputValue(
  value?: string | null
): string {
  if (!value) return "";

  return value.slice(0, 10);
}

// function dateInputToString(
//   value: string
// ): string {
//   return new Date(`${value}T00:00:00.000Z`).toString();
// }

function formatDateRange(
  start?: string | null,
  end?: string | null
) {
  if (!start && !end) {
    return "No preferred dates provided";
  }

  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  if (start && !end) {
    return formatter.format(new Date(start));
  }

  if (!start && end) {
    return formatter.format(new Date(end));
  }

  const startDate = formatter.format(
    new Date(start!)
  );

  const endDate = formatter.format(
    new Date(end!)
  );

  if (startDate === endDate) {
    return startDate;
  }

  return `${startDate} – ${endDate}`;
}

function formatTrainerRole(role: string) {
  return role
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatClientLocation(
  booking: AdminBookingDetailsResponse
) {
  const location = [
    booking.locationAddress,
    booking.locationCity,
    booking.locationCountry,
  ]
    .filter(Boolean)
    .join(", ");

  return location || "Client location";
}