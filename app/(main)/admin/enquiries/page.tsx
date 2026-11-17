import { EnquiriesView } from "@/app/features/enquiry/components/enquiries-view";
import { EnquiriesTableSkeleton } from "@/app/features/enquiry/components/table-skeleton";
import { Suspense } from "react";

export default function EnquiriesPage() {
  return (
    <Suspense fallback={<EnquiriesTableSkeleton />}>
      <EnquiriesView />
    </Suspense>
  );
}