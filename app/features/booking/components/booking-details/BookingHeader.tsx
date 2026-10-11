"use client";

import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Monitor,
  MoreHorizontal,
  Users,
} from "lucide-react";

import { useRouter } from "next/navigation";

import {
  BookingStatus,
  DeliveryMode,
} from "@/generated/prisma/enums";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AdminBookingDetailsResponse } from "../../types/admin-booking";
import { formatDateRange } from "../../utils/format-booking-date";

interface BookingHeaderProps {
  booking: AdminBookingDetailsResponse;
}

const statusConfig: Record<
  BookingStatus,
  {
    label: string;
    className: string;
  }
> = {
  OPEN: {
    label: "Open",
    className:
      "border-amber-200 bg-amber-50 text-amber-700",
  },

  CONFIRMED: {
    label: "Confirmed",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
  },

  COMPLETED: {
    label: "Completed",
    className:
      "border-slate-200 bg-slate-100 text-slate-700",
  },

  CANCELLED: {
    label: "Cancelled",
    className:
      "border-rose-200 bg-rose-50 text-rose-700",
  },
};

const deliveryModeLabels: Record<
  DeliveryMode,
  string
> = {
  ONLINE: "Online",
  CLIENT_SITE: "Client site",
  ARRANGED_VENUE: "Arranged venue",
};

export function BookingHeader({
  booking,
}: BookingHeaderProps) {
  const router = useRouter();

  const status =
    statusConfig[booking.status];

  const clientName =
    booking.organizationName ??
    booking.contactName;

  const showContactName =
    Boolean(booking.organizationName);

  const DeliveryIcon =
    booking.deliveryMode === "ONLINE"
      ? Monitor
      : MapPin;

    const dates =
  getBookingDateDisplay(booking);

  return (
    <header className="space-y-5">
      {/* Back navigation */}

      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 h-8 gap-1.5 px-2 text-muted-foreground"
        onClick={() =>
          router.push("/admin/bookings")
        }
      >
        <ArrowLeft className="size-4" />
        Bookings
      </Button>

      {/* Main heading */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="text-sm font-medium text-muted-foreground">
            {booking.reference}
          </div>

          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {booking.course.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {clientName}
            </span>

            {showContactName && (
              <>
                <span
                  aria-hidden="true"
                  className="text-border"
                >
                  •
                </span>

                <span>
                  {booking.contactName}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Status + menu */}

        <div className="flex shrink-0 items-center gap-2">
          <Badge
            variant="outline"
            className={status.className}
          >
            {status.label}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="size-9"
              >
                <MoreHorizontal className="size-4" />

                <span className="sr-only">
                  Booking options
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-44"
            >
              <DropdownMenuItem>
                Edit booking
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="text-destructive focus:text-destructive">
                Cancel booking
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Booking metadata */}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-y py-4 text-sm">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-muted-foreground" />

          <div className="flex items-center gap-1.5">
                <span>
                {dates.value}
                </span>

                <span className="text-xs text-muted-foreground">
                {dates.label}
                </span>
            </div>
        </div>

        <div className="flex items-center gap-2">
          <DeliveryIcon className="size-4 text-muted-foreground" />

          <span>
            {
              deliveryModeLabels[
                booking.deliveryMode
              ]
            }
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Users className="size-4 text-muted-foreground" />

          <span>
            {booking.participantCount}{" "}
            {booking.participantCount === 1
              ? "participant"
              : "participants"}
          </span>
        </div>
      </div>
    </header>
  );
}

function getBookingDateDisplay(
  booking: AdminBookingDetailsResponse
) {
  const scheduled =
    booking.scheduledStartDate &&
    booking.scheduledEndDate;

  return {
    label: scheduled
      ? "Scheduled"
      : "Requested",

    value: formatDateRange(
      booking.scheduledStartDate ??
        booking.preferredStartDate,

      booking.scheduledEndDate ??
        booking.preferredEndDate
    ),
  };
}