"use client";

import { useState } from "react";
import { GetAdminBookingsParams } from "@/app/features/booking/types/admin-booking";
import { BookingFilters } from "./BookingFilters";
import { BookingTable } from "./BookingTable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { useAdminBookings } from "../../hooks/use-booking";

export function BookingsManagement() {
  const [params, setParams] = useState<GetAdminBookingsParams>({
    page: 1,
    limit: 20,
  });
  const { data: response, isLoading,isFetching, isError, isPlaceholderData, refetch } = useAdminBookings(params);

  const bookings = response?.data?.bookings ?? [];
  const pagination = response?.data?.pagination;

  const handleFilterChange = (newFilters: Partial<GetAdminBookingsParams>) => {
    setParams((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setParams({ page: 1, limit: 20 });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
        <p className="text-sm text-muted-foreground">Track, source, and manage customer training bookings.</p>
      </div>

      {/* Filters */}
      <BookingFilters
        params={params}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        onRefetch={refetch}
      />

      {/* Loading Skeleton State */}
      {isLoading || isFetching && (
        <div className="space-y-3 border rounded-md p-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex flex-col items-center justify-center p-8 border rounded-md bg-destructive/5 text-destructive gap-3">
          <AlertCircle className="h-8 w-8" />
          <p className="font-semibold">Unable to load bookings</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isFetching && !isError && bookings.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 border rounded-md text-center gap-3">
          <Inbox className="h-10 w-10 text-muted-foreground" />
          <h3 className="font-semibold text-lg">No bookings found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting or clearing your filters.</p>
          <Button variant="outline" size="sm" onClick={handleResetFilters}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Data Table */}
      {!isLoading && !isError && bookings.length > 0 && (
        <>
          <BookingTable bookings={bookings} isPlaceholderData={isPlaceholderData} />

          {/* Pagination */}
          {pagination && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} bookings
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPreviousPage || isPlaceholderData}
                  onClick={() => handleFilterChange({ page: pagination.page - 1 })}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <span className="text-xs font-medium">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNextPage || isPlaceholderData}
                  onClick={() => handleFilterChange({ page: pagination.page + 1 })}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}