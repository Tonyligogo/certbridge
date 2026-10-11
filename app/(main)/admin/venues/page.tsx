import { Suspense } from "react";
import { Plus, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VenueTableSkeleton } from "@/app/features/venues/components/table-skeleton";
import { VenueTableWrapper } from "@/app/features/venues/components/venue-table-wrapper";
import { VenueHeaderActions } from "@/app/features/venues/components/venue-header-actions";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
  }>;
}

export default async function AdminVenuesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || "";
  const status = (params.status as "ACTIVE" | "INACTIVE") || undefined;

  return (
    <div className="space-y-6">
      {/* Permanent Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Venue Directory
          </h1>
          <p className="text-xs text-muted-foreground pt-1">
            Manage partner training venues, track availability, and inspect active bookings.
          </p>
        </div>

        <VenueHeaderActions />
      </div>

      {/* Suspense boundary for dynamic server-side fetching */}
      <Suspense key={`${page}-${search}-${status}`} fallback={<VenueTableSkeleton />}>
        <VenueTableWrapper page={page} search={search} status={status} />
      </Suspense>
    </div>
  );
}