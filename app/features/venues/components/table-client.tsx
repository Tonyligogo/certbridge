"use client";

import React, { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { Venue, VenuesResponse } from "@/app/features/venues/types/venue";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MoreHorizontal,
} from "lucide-react";
import { VenueSheet } from "./venue-sheet";

interface VenueTableClientProps {
  initialData: VenuesResponse;
  currentPage: number;
  currentSearch: string;
}

export function VenueTableClient({
  initialData,
  currentPage,
  currentSearch,
}: VenueTableClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [searchTerm, setSearchTerm] = useState(currentSearch);

  const { venues, pagination } = initialData;

  const updateQueryParams = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQueryParams({ search: searchTerm, page: "1" });
  };
  console.log(venues)
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search venue, city, or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
        <Button type="submit" size="sm" variant="secondary" className="h-9 text-xs" disabled={isPending}>
          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Search"}
        </Button>
      </form>

      {/* Venues Table */}
      <div className="border overflow-hidden rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary/10">
              <TableHead className="text-xs">#</TableHead>
              <TableHead className="text-xs">Venue Name</TableHead>
              <TableHead className="text-xs">Country</TableHead>
              <TableHead className="text-xs">City</TableHead>
              <TableHead className="text-xs">Capacity</TableHead>
              <TableHead className="text-xs">Bookings</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {venues.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-xs text-muted-foreground">
                  No venues found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              venues.map((venue,index) => (
                <TableRow
                  key={venue.id}
                  className={`cursor-pointer hover:bg-muted/50 transition-colors ${venue.status === 'INACTIVE' ? 'opacity-20 pointer-events-none':''} `}
                  onClick={() => setSelectedVenue(venue)}
                >
                  <TableCell>
                    {index + 1}.
                  </TableCell>
                  <TableCell>
                    {venue.name}
                  </TableCell>

                  <TableCell>
                     {venue.country}
                  </TableCell>

                  <TableCell>
                      {venue.city}
                  </TableCell>

                  <TableCell>
                      {venue.capacity ? `${venue.capacity} seats` : "N/A"}
                  </TableCell>

                  <TableCell>
                      {venue._count?.bookings ?? 0}
                  </TableCell>

                  <TableCell>
                    <Badge variant={venue.status === "ACTIVE" ? "default" : "secondary"} className="text-xs">
                      {venue.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 text-xs gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVenue(venue);
                      }}
                    >
                      <MoreHorizontal/>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
          <span>
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total venues)
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={currentPage <= 1 || isPending}
              onClick={() => updateQueryParams({ page: String(currentPage - 1) })}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={currentPage >= pagination.totalPages || isPending}
              onClick={() => updateQueryParams({ page: String(currentPage + 1) })}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Slide-over Drawer Workspace */}
      {selectedVenue ? 
      <VenueSheet
        venue={selectedVenue}
        isOpen={Boolean(selectedVenue)}
        onClose={() => setSelectedVenue(null)}
      />
      :
      null
    }
    </div>
  );
}