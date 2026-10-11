import { AdminBookingListItem } from "@/app/features/booking/types/admin-booking";
import { BookingStatus } from "@/generated/prisma/enums";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit } from "lucide-react";
import { CustomTooltip } from "@/components/custom-tooltip";
import { useRouter } from "next/navigation";
import { DeliveryMode } from "../../types";

interface BookingTableProps {
  bookings: AdminBookingListItem[];
  isPlaceholderData?: boolean;
}

const statusVariants: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  OPEN: {
    label: "Open",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-slate-100 text-slate-800 border-slate-200",
  },
  CANCELLED: {
    label: "Canceled",
    className: "bg-rose-100 text-rose-800 border-rose-200",
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

function formatPreferredDates(
  startDateStr: string | null,
  endDateStr: string | null
): string {
  if (!startDateStr && !endDateStr) {
    return "Not specified";
  }

  const formatter = new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      timeZone: "UTC",
    }
  );

  if (startDateStr && !endDateStr) {
    return formatter.format(
      new Date(startDateStr)
    );
  }

  if (!startDateStr && endDateStr) {
    return formatter.format(
      new Date(endDateStr)
    );
  }

  const start = new Date(startDateStr!);
  const end = new Date(endDateStr!);

  return `${formatter.format(start)} – ${formatter.format(end)}`;
}

export function BookingTable({
  bookings,
  isPlaceholderData,
}: BookingTableProps) {
  const router = useRouter()
  function openBooking(
    booking: AdminBookingListItem
  ) {
    router.push(
      `/admin/bookings/${booking.id}`
    );
  }
  return (
    <div
      className={`overflow-hidden rounded-md border bg-card transition-opacity ${
        isPlaceholderData
          ? "opacity-60"
          : "opacity-100"
      }`}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              Reference
            </TableHead>

            <TableHead>
              Client
            </TableHead>

            <TableHead>
              Course
            </TableHead>

            <TableHead>
              Delivery
            </TableHead>

            <TableHead>
              Resources
            </TableHead>

            <TableHead className="text-center">
              Participants
            </TableHead>

            <TableHead>
              Requested dates
            </TableHead>

            <TableHead>
              Status
            </TableHead>

            <TableHead className="w-12">
              <span className="sr-only">
                Actions
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {bookings.map((booking) => {
            const statusInfo =
              statusVariants[booking.status];

            const venueNotRequired =
              !booking.venueRequired;

            const venueLabel =
              booking.deliveryMode ===
              "CLIENT_SITE"
                ? "Client site"
                : booking.deliveryMode ===
                    "ONLINE"
                  ? "No venue"
                  : "Venue";

            return (
              <TableRow
                key={booking.id}
                className="cursor-pointer"
                onClick={() =>
                  openBooking(booking)
                }
              >
                {/* Reference */}

                <TableCell>
                  <span className="font-medium">
                    {booking.reference}
                  </span>
                </TableCell>

                {/* Client */}

                <TableCell>
                  <div className="min-w-0">
                    <div className="font-medium">
                      {booking.organizationName ??
                        booking.contactName}
                    </div>

                    {booking.organizationName && (
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {booking.contactName}
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* Course */}

                <TableCell className="max-w-56">
                  <CustomTooltip
                    text={
                      booking.course.title
                    }
                  />
                </TableCell>

                {/* Delivery */}

                <TableCell>
                  <span className="text-sm">
                    {
                      deliveryModeLabels[
                        booking.deliveryMode
                      ]
                    }
                  </span>
                </TableCell>

                {/* Resources */}

                <TableCell>
                  <div className="space-y-1">
                    <ResourceStatus
                      label="Trainer"
                      ready={
                        booking.trainerConfirmed
                      }
                    />

                    <ResourceStatus
                      label={venueLabel}
                      ready={
                        booking.venueConfirmed
                      }
                      notRequired={
                        venueNotRequired
                      }
                    />
                  </div>
                </TableCell>

                {/* Participants */}

                <TableCell className="text-center tabular-nums">
                  {booking.participantCount}
                </TableCell>

                {/* Requested dates */}

                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                  {formatPreferredDates(
                    booking.preferredStartDate,
                    booking.preferredEndDate
                  )}
                </TableCell>

                {/* Status */}

                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      statusInfo.className
                    }
                  >
                    {statusInfo.label}
                  </Badge>
                </TableCell>

                {/* Actions */}

                <TableCell
                  className="text-right"
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                      >
                        <MoreHorizontal className="size-4" />

                        <span className="sr-only">
                          Booking actions
                        </span>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                    >
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() =>
                          openBooking(booking)
                        }
                      >
                        <Eye className="mr-2 size-4" />

                        View booking
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="cursor-pointer"
                      >
                        <Edit className="mr-2 size-4" />

                        Edit booking
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}


function ResourceStatus({
  label,
  ready,
  notRequired = false,
}: {
  label: string;
  ready: boolean;
  notRequired?: boolean;
}) {
  if (notRequired) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="size-1.5 rounded-full bg-muted-foreground/40" />

        <span>{label}</span>
      </div>
    );
  }

  return (
    <div
      className={
        ready
          ? "flex items-center gap-2 text-xs text-emerald-700"
          : "flex items-center gap-2 text-xs text-amber-700"
      }
    >
      <span
        className={
          ready
            ? "size-1.5 rounded-full bg-emerald-500"
            : "size-1.5 rounded-full bg-amber-500"
        }
      />

      <span>{label}</span>
    </div>
  );
}