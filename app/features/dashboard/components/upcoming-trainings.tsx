import Link from "next/link";
import { CalendarClock, CheckCircle2, CircleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { DashboardUpcomingTraining } from "../types/dashboard";

export function UpcomingTrainings({
  trainings,
}: {
  trainings: DashboardUpcomingTraining[];
}) {
  return (
    <Card className="min-w-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-base">Upcoming trainings</CardTitle>
        <CardDescription>
          Scheduled sessions and resource readiness
        </CardDescription>
      </CardHeader>

      <CardContent>
        {trainings.length === 0 ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
            <CalendarClock className="mb-3 size-8 text-muted-foreground" />
            <p className="text-sm font-medium">No upcoming trainings</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Scheduled sessions will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {trainings.map((training) => {
              const ready = training.trainerReady && training.venueReady;

              return (
                <Link
                  key={training.id}
                  href={`/admin/bookings/${training.id}`}
                  className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {training.courseTitle}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {training.organizationName ?? training.reference}
                    </p>

                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat("en-KE", {
                        dateStyle: "medium",
                        timeZone: "Africa/Nairobi",
                      }).format(new Date(training.scheduledStartDate))}
                    </p>
                  </div>

                  <Badge variant={ready ? "secondary" : "outline"}>
                    {ready ? (
                      <CheckCircle2 className="mr-1 size-3" />
                    ) : (
                      <CircleAlert className="mr-1 size-3" />
                    )}
                    {ready ? "Ready" : "Needs review"}
                  </Badge>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}