"use client";

import {
  ArrowRight,
  Inbox,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { AdminEnquiry,EnquiriesPagination,
  EnquiryStatus } from "../types";

interface EnquiriesTableProps {
  enquiries: AdminEnquiry[];
  pagination?: EnquiriesPagination;
  isFetching?: boolean;
  onPageChange: (page: number) => void;
  onSelect: (enquiry: AdminEnquiry) => void;
}

const statusConfig: Record<
  EnquiryStatus,
  { label: string; className: string }
> = {
  NEW: {
    label: "New",
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
  },
  CONTACTED: {
    label: "Contacted",
    className:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-300",
  },
  IN_PROGRESS: {
    label: "In progress",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  },
  CONVERTED: {
    label: "Converted",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  },
  CLOSED: {
    label: "Closed",
    className: "border-border bg-muted text-muted-foreground",
  },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Nairobi",
  }).format(new Date(value));
}

export function EnquiriesTable({
  enquiries,
  pagination,
  isFetching = false,
  onPageChange,
  onSelect,
}: EnquiriesTableProps) {
  return (
    <div className="space-y-4">
      <div
        className={`overflow-hidden rounded-xl border transition-opacity ${
          isFetching ? "opacity-65" : ""
        }`}
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="pl-5">
                Reference / Customer
              </TableHead>
              <TableHead>Enquiry</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Received</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {enquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-muted">
                      <Inbox className="size-5 text-muted-foreground" />
                    </div>

                    <p className="text-sm font-semibold">
                      No enquiries found
                    </p>

                    <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                      No enquiries match your current filters.
                      Try adjusting your search or date range.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              enquiries.map((enquiry) => {
                const status = statusConfig[enquiry.status];

                return (
                  <TableRow
                    key={enquiry.id}
                    tabIndex={0}
                    role="button"
                    aria-label={`View enquiry ${enquiry.reference}`}
                    onClick={() => onSelect(enquiry)}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" ||
                        event.key === " "
                      ) {
                        event.preventDefault();
                        onSelect(enquiry);
                      }
                    }}
                    className="group cursor-pointer"
                  >
                    <TableCell className="pl-5">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold">
                          {enquiry.reference}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {enquiry.fullName}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="max-w-[240px] space-y-1">
                        <p className="truncate text-sm font-medium">
                          {enquiry.courseName ||
                            (enquiry.type === "GENERAL"
                              ? "General enquiry"
                              : "Training quotation")}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {enquiry.type === "QUOTE"
                            ? "Quotation request"
                            : "General enquiry"}

                          {enquiry.type === "QUOTE" &&
                            enquiry.participantCount != null &&
                            ` · ${enquiry.participantCount} participants`}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-sm">
                        {enquiry.organization || "—"}
                      </span>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={status.className}
                      >
                        {status.label}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <span className="whitespace-nowrap text-sm text-muted-foreground">
                        {formatDate(enquiry.createdAt)}
                      </span>
                    </TableCell>

                    <TableCell>
                      <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100" />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            {pagination.total === 0
              ? "Showing 0 enquiries"
              : `Showing ${
                  (pagination.page - 1) * pagination.limit + 1
                }–${Math.min(
                  pagination.page * pagination.limit,
                  pagination.total
                )} of ${pagination.total} enquiries`}
          </p>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              Page {pagination.page} of{" "}
              {Math.max(1, pagination.totalPages)}
            </span>

            <Button
              variant="outline"
              size="icon"
              aria-label="Previous page"
              disabled={pagination.page <= 1 || isFetching}
              onClick={() =>
                onPageChange(pagination.page - 1)
              }
            >
              <ChevronLeft className="size-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              aria-label="Next page"
              disabled={
                pagination.page >= pagination.totalPages ||
                isFetching
              }
              onClick={() =>
                onPageChange(pagination.page + 1)
              }
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}