import { BookingStatus, DeliveryMode } from "@/generated/prisma/enums";
import { GetAdminBookingsParams } from "@/app/features/booking/types/admin-booking";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw, Search, X } from "lucide-react";

interface BookingFiltersProps {
  params: GetAdminBookingsParams;
  onFilterChange: (filters: Partial<GetAdminBookingsParams>) => void;
  onResetFilters: () => void;
  onRefetch: () => void;
}

export function BookingFilters({ params, onFilterChange, onResetFilters, onRefetch }: BookingFiltersProps) {
  const hasActiveFilters = Boolean(
    params.search || params.status || params.deliveryMode || params.createdFrom || params.createdTo
  );

  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px] w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search reference, client, course..."
          value={params.search ?? ""}
          onChange={(e) => onFilterChange({ search: e.target.value || undefined, page: 1 })}
          className="pl-9"
        />
      </div>

      {/* Status Filter */}
      <Select
        value={params.status ?? "ALL"}
        onValueChange={(val) =>
          onFilterChange({ status: val === "ALL" ? undefined : (val as BookingStatus), page: 1 })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Statuses</SelectItem>
          {Object.values(BookingStatus).map((status) => (
            <SelectItem key={status} value={status}>
              {status.replace(/_/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Delivery Mode Filter */}
      <Select
        value={params.deliveryMode ?? "ALL"}
        onValueChange={(val) =>
          onFilterChange({ deliveryMode: val === "ALL" ? undefined : (val as DeliveryMode), page: 1 })
        }
      >
        <SelectTrigger className="w-[170px]">
          <SelectValue placeholder="All Delivery Modes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Modes</SelectItem>
          {Object.values(DeliveryMode).map((mode) => (
            <SelectItem key={mode} value={mode}>
              {mode.replace(/_/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant='outline' onClick={onRefetch}> <RefreshCw/> </Button>

      {/* Reset Action */}
      {hasActiveFilters && (
        <Button variant="ghost" onClick={onResetFilters} className="h-9 px-2.5 text-muted-foreground">
          <X className="mr-1.5 h-4 w-4" /> Reset
        </Button>
      )}
    </div>
  );
}