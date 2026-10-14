import Link from "next/link";
import {
  ArrowUpRight,
} from "lucide-react";

import type { DashboardData } from "../types/dashboard";
import type { DashboardPeriod } from "../server/get-dashboard-data";

import { Button } from "@/components/ui/button";
import { DashboardStats } from "./dashboard-stats";
import { RevenueChart } from "./revenue-chart";
import { NeedsAttention } from "./needs-attention";
import { RecentBookings } from "./recent-bookings";
import { UpcomingTrainings } from "./upcoming-trainings";
import { TopCourses } from "./top-courses";
import { AwaitingResponse } from "./awaiting-response";
import { DashboardPeriodSelect } from "./dashboard-period-select";

interface DashboardViewProps {
  data: DashboardData;
  period: DashboardPeriod;
}

export function DashboardView({
  data,
  period,
}: DashboardViewProps) {

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor bookings, training operations, and financial performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <DashboardPeriodSelect period={period} />

          <Button asChild>
            <Link href="/admin/bookings">
              View bookings
              <ArrowUpRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>
      </div>

      <DashboardStats stats={data.stats} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(360px,1fr)]">
        <RevenueChart data={data.revenue} currency={data.stats.currency} />

        <NeedsAttention items={data.attention} />
      </div>

      {data.awaitingResponse.length > 0 && (
        <AwaitingResponse items={data.awaitingResponse} />
      )}

      <RecentBookings bookings={data.recentBookings} />

      <div className="grid gap-6 xl:grid-cols-2">
        <UpcomingTrainings trainings={data.upcomingTrainings} />
        <TopCourses courses={data.topCourses} />
      </div>
    </div>
  );
}