import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { DashboardRecentBooking } from "../types/dashboard";

const statusVariants = {
  OPEN: "secondary",
  CONFIRMED: "default",
  COMPLETED: "outline",
  CANCELLED: "destructive",
} as const;

const deliveryLabels = {
  ONLINE: "Online",
  CLIENT_SITE: "Client site",
  ARRANGED_VENUE: "Arranged venue",
} as const;

export function RecentBookings({
  bookings,
}: {
  bookings: DashboardRecentBooking[];
}) {
  return (
    <Card className="min-w-0 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base">Recent bookings</CardTitle>
          <CardDescription>
            Latest training requests and their current progress
          </CardDescription>
        </div>

        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/bookings">
            View all
            <ArrowUpRight className="ml-1 size-4" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent>
        {bookings.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No bookings found for this period.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Next action</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <Link
                        href={`/admin/bookings/${booking.id}`}
                        className="block hover:underline"
                      >
                        <p className="text-sm font-medium">
                          {booking.reference}
                        </p>
                        <p className="mt-1 max-w-[240px] truncate text-xs text-muted-foreground">
                          {booking.courseTitle}
                        </p>
                      </Link>
                    </TableCell>

                    <TableCell className="text-sm">
                      {booking.organizationName ?? booking.contactName}
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {deliveryLabels[booking.deliveryMode]}
                    </TableCell>

                    <TableCell>
                      <Badge variant={statusVariants[booking.status]}>
                        {booking.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-sm">
                      {booking.primaryAction?.label ?? "—"}
                    </TableCell>

                    <TableCell className="text-right text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat("en-KE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        timeZone: "Africa/Nairobi",
                      }).format(new Date(booking.createdAt))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}