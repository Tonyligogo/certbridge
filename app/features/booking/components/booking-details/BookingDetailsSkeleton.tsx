import { Skeleton } from "@/components/ui/skeleton";

export function BookingDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-5">
        <Skeleton className="h-8 w-24" />

        <div className="flex justify-between gap-4">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />

            <Skeleton className="h-8 w-80 max-w-full" />

            <Skeleton className="h-4 w-52" />
          </div>

          <Skeleton className="h-8 w-24" />
        </div>

        <div className="flex gap-6 border-y py-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-28" />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>

        <div className="space-y-6">
          <Skeleton className="h-52 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
    </div>
  );
}