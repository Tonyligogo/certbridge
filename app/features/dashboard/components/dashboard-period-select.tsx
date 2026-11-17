"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { DashboardPeriod } from "../server/get-dashboard-data";

export function DashboardPeriodSelect({
  period,
}: {
  period: DashboardPeriod;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(value: DashboardPeriod) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", value);

    router.push(`?${params.toString()}`);
  }

  return (
    <Select value={period} onValueChange={(value) => handleChange(value as DashboardPeriod)}>
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder="Select period" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="THIS_MONTH">This month</SelectItem>
        <SelectItem value="LAST_MONTH">Last month</SelectItem>
        <SelectItem value="LAST_90_DAYS">Last 90 days</SelectItem>
        <SelectItem value="THIS_YEAR">This year</SelectItem>
        <SelectItem value="ALL_TIME">All time</SelectItem>
      </SelectContent>
    </Select>
  );
}