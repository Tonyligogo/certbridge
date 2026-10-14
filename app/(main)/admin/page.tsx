import { DashboardView } from "@/app/features/dashboard/components/dashboard-view";
import { getDashboardData, type DashboardPeriod } from "@/app/features/dashboard/server/get-dashboard-data";

const periods: DashboardPeriod[] = [
  "THIS_MONTH",
  "LAST_MONTH",
  "LAST_90_DAYS",
  "THIS_YEAR",
  "ALL_TIME",
];

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period: requestedPeriod } = await searchParams;

  const period: DashboardPeriod = periods.includes(
    requestedPeriod as DashboardPeriod
  )
    ? (requestedPeriod as DashboardPeriod)
    : "THIS_MONTH";

  const dashboard = await getDashboardData(period);

  return <DashboardView data={dashboard} period={period} />;
}