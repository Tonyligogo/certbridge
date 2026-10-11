import {
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function BookingDetailsError() {
  const router = useRouter();

  return (
    <div className="flex min-h-80 items-center justify-center">
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded-full bg-muted">
          <AlertCircle className="size-5 text-muted-foreground" />
        </div>

        <h2 className="font-semibold">
          Booking unavailable
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          The booking could not be loaded.
          It may no longer exist or there may
          have been a temporary problem.
        </p>

        <Button
          variant="outline"
          className="mt-4"
          onClick={() =>
            router.push("/admin/bookings")
          }
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to bookings
        </Button>
      </div>
    </div>
  );
}