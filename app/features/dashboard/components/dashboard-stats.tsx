import {
  CalendarDays,
  CalendarCheck2,
  Wallet,
  ReceiptText,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { DashboardStats as DashboardStatsType } from "../types/dashboard";

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function DashboardStats({
  stats,
}: {
  stats: DashboardStatsType;
}) {
  const cards = [
    {
      label: "Total bookings",
      value: stats.totalBookings.toLocaleString("en-KE"),
      description: "Bookings in selected period",
      icon: CalendarDays,
    },
    {
      label: "Active bookings",
      value: stats.activeBookings.toLocaleString("en-KE"),
      description: "Open and confirmed bookings",
      icon: CalendarCheck2,
    },
    {
      label: "Revenue collected",
      value: formatMoney(stats.revenueCollected, stats.currency),
      description: "Completed payments",
      icon: Wallet,
    },
    {
      label: "Outstanding balance",
      value: formatMoney(stats.outstandingBalance, stats.currency),
      description: "Unpaid issued invoices",
      icon: ReceiptText,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.label} className="shadow-none">
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </p>
                <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                  <Icon className="size-4 text-muted-foreground" />
                </div>
              </div>

              <div>
                <p className="text-2xl font-semibold tracking-tight">
                  {card.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {card.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}