import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building, Loader2, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { VenueAssignmentStatus } from "./venue-assignment-status";
import { LoadingState } from "./loading-state";
import { ResourceSourcingStatus } from "@/generated/prisma/enums";

export interface AssignedVenue {
  id: string;
  venueId: string;

  status: ResourceSourcingStatus;

  agreedAmount: string | null;
  currency: string;
  notes: string | null;
  confirmedAt: string | null;

  venue: {
    id: string;
    name: string;
    city: string;
    country: string;
    address: string | null;
    capacity: number | null;
  };
}
interface AssignedVenuesProps {
  venues: AssignedVenue[];

  isLoading: boolean;
  isRemoving: boolean;

  onRemove: (venueId: string) => void;
  onEdit: (venue: AssignedVenue) => void;
  onFindVenue: () => void;
}

export default function AssignedVenues({
  venues,
  isLoading,
  isRemoving,
  onRemove,
  onFindVenue,
  onEdit
}: AssignedVenuesProps) {
  if (isLoading) {
    return (
      <LoadingState text="Loading assigned venues..." />
    );
  }

  if (venues.length === 0) {
    return (
      <div className="rounded-lg border border-dashed px-4 py-10 text-center">
        <Building className="mx-auto size-8 text-muted-foreground/60" />

        <p className="mt-3 text-sm font-medium">
          No venue assigned
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Find a suitable venue for this booking.
        </p>

        <Button
          type="button"
          size="sm"
          variant="outline"
          className="mt-4"
          onClick={onFindVenue}
        >
          <Plus className="mr-2 size-4" />
          Find venue
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="hidden md:table-header-group">
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead>Venue</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {venues.map((bookingVenue) => {
            const venue =
              bookingVenue.venue;

            const location = [
              venue.city,
              venue.country,
            ]
              .filter(Boolean)
              .join(", ");

            return (
              <TableRow
                key={bookingVenue.id}
                className="
                  block border-b p-4 last:border-b-0
                  md:table-row md:p-0
                "
              >
                {/* Venue */}
                <TableCell className="block p-0 md:table-cell md:p-4">
                  <div>
                    <p className="text-sm font-semibold">
                      {venue.name}
                    </p>

                    {location && (
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3" />
                        {location}
                      </p>
                    )}
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell className="mt-3 block p-0 md:mt-0 md:table-cell md:p-4">
                  <VenueAssignmentStatus
                    status={
                      bookingVenue.status
                    }
                  />
                </TableCell>

                {/* Amount */}
                <TableCell className="mt-2 block p-0 text-xs md:mt-0 md:table-cell md:p-4">
                  {bookingVenue.agreedAmount != null
                    ? `${bookingVenue.currency} ${bookingVenue.agreedAmount}`
                    : "—"}
                </TableCell>

                {/* actions */}
                <TableCell className="mt-3 block p-0 md:mt-0 md:table-cell md:p-4">
                  <div className="flex gap-2 md:justify-end">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-8 flex-1 text-xs md:flex-none"
                      onClick={() => onEdit(bookingVenue)}
                    >
                      <Pencil className="mr-1.5 size-3.5" />
                      Edit
                    </Button>

                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() =>
                        onRemove(bookingVenue.venueId)
                      }
                      disabled={isRemoving}
                    >
                      {isRemoving ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="size-3.5" />
                      )}

                      <span className="sr-only">
                        Remove venue
                      </span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

