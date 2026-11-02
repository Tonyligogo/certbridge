import Link from "next/link";
import { ArrowUpRight, MessageSquareText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card";

import type { DashboardData } from "../types/dashboard";

type RecentEnquiry = DashboardData["recentEnquiries"][number];

const statusLabels: Record<RecentEnquiry["status"], string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  IN_PROGRESS: "In progress",
  CONVERTED: "Converted",
  CLOSED: "Closed",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function RecentEnquiries({
  enquiries,
}: {
  enquiries: DashboardData["recentEnquiries"];
}) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Recent enquiries</CardTitle>

        <CardDescription>
          Latest quotation requests and general enquiries.
        </CardDescription>

        <CardAction>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/enquiries">
              View all
              <ArrowUpRight className="ml-1 size-4" />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        {enquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-muted">
              <MessageSquareText className="size-5 text-muted-foreground" />
            </div>

            <p className="text-sm font-medium">
              No enquiries yet
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              New enquiries will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {enquiries.map((enquiry) => (
              <Link
                key={enquiry.id}
                href={`/admin/enquiries/${enquiry.id}`}
                className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0 transition-colors hover:opacity-75"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-medium">
                      {enquiry.fullName}
                    </p>

                    <Badge variant="outline" className="text-[10px]">
                      {enquiry.type === "QUOTE"
                        ? "Quotation"
                        : "General"}
                    </Badge>
                  </div>

                  <p className="truncate text-xs text-muted-foreground">
                    {enquiry.courseName ||
                      enquiry.organization ||
                      "General enquiry"}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {enquiry.reference} · {formatDate(enquiry.createdAt)}
                  </p>
                </div>

                <Badge
                  variant={
                    enquiry.status === "NEW"
                      ? "default"
                      : "secondary"
                  }
                  className="shrink-0"
                >
                  {statusLabels[enquiry.status]}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}