"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartNoAxesColumnIncreasing } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { DashboardRevenuePoint } from "../types/dashboard";

export function RevenueChart({
  data,
  currency,
}: {
  data: DashboardRevenuePoint[];
  currency: string;
}) {
  const hasRevenue = data.some((item) => item.amount > 0);

  const formatMoney = (value: number) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <Card className="min-w-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-base">Revenue overview</CardTitle>
        <CardDescription>
          Payments collected over the last six months
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!hasRevenue ? (
          <div className="flex h-[290px] flex-col items-center justify-center text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
              <ChartNoAxesColumnIncreasing className="size-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">No revenue recorded yet</p>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              Completed payments will appear here as revenue is collected.
            </p>
          </div>
        ) : (
          <div className="h-[290px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value: number) =>
                    value >= 1000000
                      ? `${(value / 1000000).toFixed(1)}M`
                      : value >= 1000
                        ? `${Math.round(value / 1000)}K`
                        : String(value)
                  }
                />
                <Tooltip
                  formatter={(value) => [
                    formatMoney(Number(value ?? 0)),
                    "Revenue",
                  ]}
                />
                <Bar
                  dataKey="amount"
                  fill="var(--primary)"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}