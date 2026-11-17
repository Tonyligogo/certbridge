import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import type { DashboardAttentionItem } from "../types/dashboard";

export function NeedsAttention({
  items,
}: {
  items: DashboardAttentionItem[];
}) {
  return (
    <Card className="min-w-0 shadow-none">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle className="text-base">Needs attention</CardTitle>
          <CardDescription>
            Booking tasks that require action
          </CardDescription>
        </div>

        <Badge variant="secondary">
          {items.length} pending
        </Badge>
      </CardHeader>

      <CardContent>
        {items.length === 0 ? (
          <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
            <CheckCircle2 className="mb-3 size-8 text-muted-foreground" />
            <p className="text-sm font-medium">All caught up</p>
            <p className="mt-1 text-xs text-muted-foreground">
              There are no pending booking actions.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {items.map((item) => (
              <Link
                key={item.bookingId}
                href={`/admin/bookings/${item.bookingId}`}
                className="group flex items-start gap-3 py-3 first:pt-0 last:pb-0 hover:bg-muted/30"
              >
                <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                  <CircleAlert className="size-4 text-amber-600" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">
                      {item.action.label}
                    </p>
                    {item.action.priority === "HIGH" && (
                      <Badge variant="outline" className="text-[10px]">
                        High
                      </Badge>
                    )}
                  </div>

                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {item.courseTitle}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.organizationName ?? item.reference}
                  </p>
                </div>

                <ArrowRight className="mt-2 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}