import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardAttentionItem } from "../types/dashboard";

export function AwaitingResponse({
  items,
}: {
  items: DashboardAttentionItem[];
}) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock3 className="size-4 text-muted-foreground" />
          Awaiting response
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.bookingId}
            href={`/admin/bookings/${item.bookingId}`}
            className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium">{item.action.label}</p>
              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
            </div>
            <p className="mt-2 line-clamp-1 text-xs text-muted-foreground">
              {item.courseTitle}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {item.organizationName ?? item.reference}
            </p>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}