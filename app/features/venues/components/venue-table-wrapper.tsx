import type { VenueStatus } from "@/app/features/venues/types/venue";
import { getVenues } from "../services/venues-server-service";
import { VenueTableClient } from "./table-client";

interface VenueTableWrapperProps {
  page: number;
  search: string;
  status?: VenueStatus;
}

export async function VenueTableWrapper({ page, search, status }: VenueTableWrapperProps) {
  const data = await getVenues({
    page,
    pageSize: 15,
    search,
    status,
  });

  return <VenueTableClient initialData={data} currentPage={page} currentSearch={search} />;
}