"use client";

import type { BookingVenueStatus } from "../types/venue";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, DollarSign } from "lucide-react";
import { useVenueBookings } from "../hooks/use-venues";

interface VenueBookingsTabProps {
  venueId: string;
}

const statusVariants: Record<BookingVenueStatus, { label: string; className: string }> = {
  CONSIDERING: { label: "Considering", className: "bg-amber-100 text-amber-800 border-amber-200" },
  CONTACTED: { label: "Contacted", className: "bg-blue-100 text-blue-800 border-blue-200" },
  AVAILABLE: { label: "Available", className: "bg-teal-100 text-teal-800 border-teal-200" },
  UNAVAILABLE: { label: "Unavailable", className: "bg-rose-100 text-rose-800 border-rose-200" },
  CONFIRMED: { label: "Confirmed", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  REPLACED: { label: "Replaced", className: "bg-purple-100 text-purple-800 border-purple-200" },
  CANCELLED: { label: "Cancelled", className: "bg-gray-100 text-gray-800 border-gray-200" },
};

export function VenueBookingsTab({ venueId }: VenueBookingsTabProps) {
  const { data: response, isPending } = useVenueBookings(venueId);

  const bookings = response?.data?.bookings || []

  if (bookings.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed rounded-xl m-6 text-xs text-muted-foreground space-y-2 bg-muted/20">
        <Calendar className="h-6 w-6 mx-auto text-muted-foreground/60" />
        <p className="font-semibold text-foreground">No Booking History</p>
        <p>This venue has not been attached to any course bookings yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Associated Bookings ({bookings.length})
        </span>
      </div>

      <div className="space-y-3">
        {bookings.map((item) => {
          const badgeConfig = statusVariants[item.status] || {
            label: item.status,
            className: "bg-gray-100 text-gray-800",
          };

          return (
            <div
              key={item.id}
              className="p-4 rounded-xl border bg-card hover:border-primary/40 transition-colors space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-[10px] ${badgeConfig.className}`}>
                      {badgeConfig.label}
                    </Badge>
                  </div>
                  <p className="text-xs font-semibold text-foreground pt-1 line-clamp-1">
                    {item.booking?.course?.title || "Custom Course Training"}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="flex items-center gap-4 text-[11px] text-muted-foreground flex-wrap pt-1 border-t">
                {item.booking?.participantCount && (
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-primary" /> {item.booking.participantCount} Attendees
                  </span>
                )}

                {item.agreedAmount && (
                  <span className="flex items-center gap-1 font-mono font-medium text-foreground">
                    <DollarSign className="h-3 w-3 text-emerald-600" />
                    {item.currency} {parseFloat(item.agreedAmount).toLocaleString()}
                  </span>
                )}
              </div>

              {item.notes && (
                <p className="text-[11px] italic text-muted-foreground bg-muted/40 p-2 rounded">
                  {`"{item.notes}"`}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}