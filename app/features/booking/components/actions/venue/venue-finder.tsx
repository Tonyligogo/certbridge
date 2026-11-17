import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, FilterX, Loader2, MapPin, Search, Users } from "lucide-react";
import { LoadingState } from "./loading-state";
import { EmptyState } from "./empty-state";
import { Venue } from "@/app/features/venues/types/venue";

interface VenueFinderProps {
  candidateVenues: Venue[];

  isLoading: boolean;
  isFetching: boolean;
  isAssigningVenue: boolean;

  searchTerm: string;
  setSearchTerm: (value: string) => void;

  filterCountry: string;
  setFilterCountry: (value: string) => void;

  filterCity: string;
  setFilterCity: (value: string) => void;

  minCapacity: string;
  setMinCapacity: (value: string) => void;

  hasFilters: boolean;
  clearFilters: () => void;

  onAssign: (venueId: string) => void;
}

export function VenueFinder({
  candidateVenues,
  isLoading,
  isFetching,
  isAssigningVenue,
  searchTerm,
  setSearchTerm,
  filterCountry,
  setFilterCountry,
  filterCity,
  setFilterCity,
  minCapacity,
  setMinCapacity,
  hasFilters,
  clearFilters,
  onAssign,
}: VenueFinderProps) {
  return (
    <div className="space-y-4 border-t pt-6">
      {/* Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search venues..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            className="pl-9"
          />
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <Input
            placeholder="Country"
            value={filterCountry}
            onChange={(event) =>
              setFilterCountry(event.target.value)
            }
          />

          <Input
            placeholder="City"
            value={filterCity}
            onChange={(event) =>
              setFilterCity(event.target.value)
            }
          />

          <Input
            type="number"
            min={0}
            placeholder="Min. capacity"
            value={minCapacity}
            onChange={(event) =>
              setMinCapacity(event.target.value)
            }
          />
        </div>

        {hasFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-muted-foreground"
            onClick={clearFilters}
          >
            <FilterX className="mr-1.5 size-3.5" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <LoadingState text="Loading venue candidates..." />
      ) : candidateVenues.length === 0 ? (
        <EmptyState
          title="No matching venues"
          description="Try adjusting your search or filters."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="hidden md:table-header-group">
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead>Venue</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead className="w-[100px] text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {candidateVenues.map((venue) => {
                const location = [
                  venue.city,
                  venue.country,
                ]
                  .filter(Boolean)
                  .join(", ");

                return (
                  <TableRow
                    key={venue.id}
                    className="
                      block border-b p-4 last:border-b-0
                      hover:bg-muted/30
                      md:table-row md:p-0
                    "
                  >
                    {/* Venue */}
                    <TableCell className="block p-0 md:table-cell md:p-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">
                          {venue.name}
                        </p>

                        {venue.description && (
                          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                            {venue.description}
                          </p>
                        )}

                        {venue.address && (
                          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground md:hidden">
                            {venue.address}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    {/* Location */}
                    <TableCell className="mt-3 block p-0 md:mt-0 md:table-cell md:p-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="size-3.5 shrink-0" />

                        <span>
                          {location || "Not specified"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Capacity */}
                    <TableCell className="mt-2 block p-0 md:mt-0 md:table-cell md:p-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Users className="size-3.5 shrink-0" />

                        <span>
                          {venue.capacity != null
                            ? `${venue.capacity} seats`
                            : "Not specified"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Action */}
                    <TableCell className="mt-3 block p-0 md:mt-0 md:table-cell md:p-4 md:text-right">
                      <Button
                        type="button"
                        size="sm"
                        className="h-8 w-full text-xs md:w-auto"
                        onClick={() =>
                          onAssign(venue.id)
                        }
                        disabled={isAssigningVenue}
                      >
                        {isAssigningVenue ? (
                          <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="mr-1.5 size-3.5" />
                        )}

                        Assign
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {isFetching &&
        !isLoading &&
        candidateVenues.length > 0 && (
          <div className="flex items-center justify-center gap-2 py-1 text-xs text-muted-foreground">
            <Loader2 className="size-3 animate-spin" />
            Updating results...
          </div>
        )}
    </div>
  );
}