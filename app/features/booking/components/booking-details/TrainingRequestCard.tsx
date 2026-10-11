import {
  CalendarDays,
  GraduationCap,
  MapPin,
  Monitor,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { DetailItem } from "./detail-item";
import type { AdminBookingDetailsResponse } from "../../types/admin-booking";
import { formatDateRange } from "../../utils/format-booking-date";

interface TrainingRequestCardProps {
  booking: AdminBookingDetailsResponse;
}

const deliveryModeLabels = {
  ONLINE: "Online",
  CLIENT_SITE: "Client site",
  ARRANGED_VENUE: "Arranged venue",
} as const;

export function TrainingRequestCard({
  booking,
}: TrainingRequestCardProps) {
  const scheduled =
    Boolean(
      booking.scheduledStartDate
    );

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">
          Training request
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <DetailItem
            icon={GraduationCap}
            label="Course"
            value={booking.course.title}
          />

          <DetailItem
            icon={
              booking.deliveryMode ===
              "ONLINE"
                ? Monitor
                : MapPin
            }
            label="Delivery"
            value={
              deliveryModeLabels[
                booking.deliveryMode
              ]
            }
          />

          <DetailItem
            icon={CalendarDays}
            label="Requested dates"
            value={formatDateRange(
              booking.preferredStartDate,
              booking.preferredEndDate
            )}
          />

          <DetailItem
            icon={Users}
            label="Participants"
            value={`${booking.participantCount} ${
              booking.participantCount ===
              1
                ? "participant"
                : "participants"
            }`}
          />

          {scheduled && (
            <DetailItem
              icon={CalendarDays}
              label="Scheduled dates"
              value={formatDateRange(
                booking.scheduledStartDate,
                booking.scheduledEndDate
              )}
            />
          )}

          <TrainingLocation
            booking={booking}
          />
        </div>

        {booking.specialRequirements && (
          <>
            <div className="border-t" />

            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Special requirements
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                {
                  booking.specialRequirements
                }
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function TrainingLocation({
  booking,
}: {
  booking: AdminBookingDetailsResponse;
}) {
  if (
    booking.deliveryMode === "ONLINE"
  ) {
    return (
      <DetailItem
        icon={Monitor}
        label="Location"
        value="Remote / online"
      />
    );
  }

  if (
    booking.deliveryMode ===
    "CLIENT_SITE"
  ) {
    const location = [
      booking.locationAddress,
      booking.locationCity,
      booking.locationCountry,
    ]
      .filter(Boolean)
      .join(", ");

    return (
  <DetailItem
    icon={MapPin}
    label="Client location"
  >
    <div className="mt-0.5">
      <p className="text-sm font-medium">
        {location ||
          "Location not specified"}
      </p>

      {booking.locationNotes && (
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {booking.locationNotes}
        </p>
      )}
    </div>
  </DetailItem>
);
  }

  const confirmedVenue =
    booking.venues.find(
      ({ status }) =>
        status === "CONFIRMED"
    );

  if (!confirmedVenue) {
    return (
      <DetailItem
        icon={MapPin}
        label="Venue"
        value="To be arranged"
      />
    );
  }

  const venue =
    confirmedVenue.venue;

  const location = [
    venue.city,
    venue.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <DetailItem
      icon={MapPin}
      label="Venue"
    >
      <div className="mt-0.5">
        <p className="text-sm font-medium">
          {venue.name}
        </p>

        {location && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {location}
          </p>
        )}
      </div>
    </DetailItem>
  );
}