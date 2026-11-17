"use client";

import {
  AlertCircle,
  ArrowRightLeft,
  ChevronDown,
  Clock3,
  Loader2,
  MessageSquareText,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  UserRound,
  XCircle,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AdminEnquiryDetail, EnquiryStatus } from "../types";
import { CopyableField } from "@/components/web/copyableField";
import { useState } from "react";
import { EditEnquiryDetails } from "./EditEnquiryDetails";

interface EnquiryDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enquiry?: AdminEnquiryDetail | null;
  isLoading?: boolean;
  onStatusChange?: () => void;
  onAddNote?: () => void;
  onConvert?: () => void;
  onViewBooking?: () => void;
  isError?: boolean;
  onRetry?: () => void;
  onReopenEnquiry?: () => void;
  onCloseEnquiry?: () => void;
  isSubmitting?: boolean;
}

const STATUS_LABELS: Record<EnquiryStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  IN_PROGRESS: "In progress",
  CONVERTED: "Converted",
  CLOSED: "Closed",
};

const STATUS_STYLES: Record<EnquiryStatus, string> = {
  NEW: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900",
  CONTACTED:
    "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-900",
  IN_PROGRESS:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900",
  CONVERTED:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900",
  CLOSED: "bg-muted text-muted-foreground border-border",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeZone: "Africa/Nairobi",
  }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Nairobi",
  }).format(new Date(value));
}

function InfoField({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="wrap-break-word text-sm font-medium">{value ?? "—"}</p>
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div className="space-y-7 p-5">
      <div className="space-y-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-52" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Separator />
      <div className="space-y-4">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-3/4" />
        <div className="grid grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-32" />
            </div>
          ))}
        </div>
        <Skeleton className="h-24 w-full" />
      </div>
      <Separator />
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-16 w-full" />
    </div>
  );
}

export function EnquiryDetailsSheet({
  open,
  onOpenChange,
  enquiry,
  isLoading = false,
  isError = false,
  onRetry,
  onStatusChange,
  onAddNote,
  onReopenEnquiry,
  onConvert,
  onViewBooking,
  onCloseEnquiry,
  isSubmitting,
}: EnquiryDetailsSheetProps) {
  const isConverted = enquiry?.status === "CONVERTED";
  const isClosed = enquiry?.status === "CLOSED";
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-170"
      >
        {/* Sticky header and actions */}
        <div className="shrink-0 border-b bg-background">
          <SheetHeader className="gap-3 px-5 py-5 pr-12">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {enquiry?.type === "GENERAL"
                  ? "General enquiry"
                  : "Quotation request"}
              </p>

              <SheetTitle className="text-xl font-semibold tracking-tight">
                {enquiry?.reference ?? "Enquiry details"}
              </SheetTitle>

              <SheetDescription className="flex flex-wrap items-center gap-2">
                {enquiry ? (
                  <>
                    <Badge
                      variant="outline"
                      className={STATUS_STYLES[enquiry.status]}
                    >
                      {STATUS_LABELS[enquiry.status]}
                    </Badge>
                    <span>Received {formatDate(enquiry.createdAt)}</span>
                  </>
                ) : (
                  "Customer request and activity history"
                )}
              </SheetDescription>
            </div>
          </SheetHeader>

          <div className="flex flex-wrap items-center gap-2 px-5 pb-4">
            {/* Primary action */}
            {isConverted && enquiry?.bookingId ? (
              <Button
                size="sm"
                onClick={onViewBooking}
                disabled={!onViewBooking}
              >
                <ArrowRightLeft className="size-4" />
                View booking
              </Button>
            ) : isClosed ? (
              <Button
                size="sm"
                variant="outline"
                onClick={onReopenEnquiry}
                disabled={!onReopenEnquiry || isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <RotateCcw className="size-4" />
                )}
                Reopen enquiry
              </Button>
            ) : !isConverted ? (
              <Button
                size="sm"
                onClick={onConvert}
                disabled={!enquiry || isLoading || !onConvert}
              >
                <ArrowRightLeft className="size-4" />
                Convert to booking
              </Button>
            ) : null}

            {enquiry &&
              !isClosed &&
              !isConverted && (
                <Button
                  size="sm"
                  variant={isEditing ? "secondary" : "outline"}
                  onClick={() => setIsEditing((previous) => !previous)}
                  disabled={isLoading || isSubmitting}
                >
                  <Pencil className="size-4" />
                  {isEditing ? "View details" : "Edit details"}
                </Button>
              )}

            {/* Additional actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!enquiry || isLoading}
                  aria-label="More enquiry actions"
                >
                  <MoreHorizontal className="size-4" />
                  <ChevronDown className="size-3" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                {/* Notes are available for all enquiries */}
                <DropdownMenuItem onSelect={onAddNote} disabled={!onAddNote}>
                  <Plus className="size-4" />
                  Add internal note
                </DropdownMenuItem>

                {/* Status actions only for active enquiries */}
                {!isClosed && !isConverted && (
                  <>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onSelect={onStatusChange}
                      disabled={!onStatusChange}
                    >
                      <RefreshCw className="size-4" />
                      Change status
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Dedicated close action */}
                    <DropdownMenuItem
                      onSelect={onCloseEnquiry}
                      disabled={!onCloseEnquiry}
                      className="text-destructive focus:text-destructive"
                    >
                      <XCircle className="size-4" />
                      Close enquiry
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Scrollable details */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {isError ? (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-20 text-center">
              <AlertCircle className="size-7 text-destructive" />

              <div className="space-y-1">
                <p className="text-sm font-semibold">Unable to load enquiry</p>
                <p className="text-sm text-muted-foreground">
                  We couldn&apos;t retrieve the enquiry details.
                </p>
              </div>

              <Button variant="outline" size="sm" onClick={onRetry}>
                Try again
              </Button>
            </div>
          ) : isLoading || !enquiry ? (
            <DetailsSkeleton />
          ) : isEditing ? (
            <EditEnquiryDetails
              enquiry={enquiry}
              onCancel={() => setIsEditing(false)}
              onSuccess={() => setIsEditing(false)}
            />
          ) : 
          (
            <div className="space-y-6 px-5 py-6">
              {/* Customer */}
              <section className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <UserRound className="size-5 text-muted-foreground" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold">{enquiry.fullName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {enquiry.organization || "Individual enquiry"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <CopyableField label="Email address" value={enquiry.email} />

                  <CopyableField label="Phone number" value={enquiry.phone} />
                </div>
              </section>

              <Separator />

              {/* Training requirements */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold">
                  {enquiry.type === "QUOTE"
                    ? "Training requirements"
                    : "Enquiry information"}
                </h3>

                {enquiry.type === "QUOTE" && (
                  <>
                    <CopyableField
                      label="Requested course"
                      value={enquiry.courseName || enquiry.course?.title}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <InfoField
                        label="Participants"
                        value={enquiry.participantCount}
                      />
                      <InfoField
                        label="Delivery mode"
                        value={
                          enquiry.deliveryMode
                            ? {
                                ONLINE: "Online",
                                CLIENT_SITE: "Client site",
                                ARRANGED_VENUE: "Arranged venue",
                              }[enquiry.deliveryMode]
                            : null
                        }
                      />
                      <InfoField
                        label="Preferred date"
                        value={
                          enquiry.preferredDate
                            ? formatDate(enquiry.preferredDate)
                            : null
                        }
                      />
                      <InfoField label="Request type" value="Quotation" />
                    </div>
                  </>
                )}

                <div className="rounded-lg border bg-muted/30 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <MessageSquareText className="size-4" />
                    Customer message
                  </div>
                  <p className="whitespace-pre-wrap wrap-break-word text-sm leading-relaxed">
                    {enquiry.message || "No message provided."}
                  </p>
                </div>
              </section>

              <Separator />

              {/* Activity history */}
              <section className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold">Activity & notes</h3>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onAddNote}
                    disabled={!onAddNote}
                  >
                    <Plus className="size-4" />
                    Add note
                  </Button>
                </div>

                {enquiry.activities.length === 0 ? (
                  <p className="rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground">
                    No activity recorded yet.
                  </p>
                ) : (
                  <div className="space-y-0">
                    {enquiry.activities.map((activity, index) => (
                      <div key={activity.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="mt-1.5 size-2 rounded-full bg-primary" />
                          {index < enquiry.activities.length - 1 && (
                            <div className="my-1 w-px flex-1 bg-border" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1 pb-5">
                          <p className="wrap-break-word text-sm">
                            {activity.description}
                          </p>
                          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock3 className="size-3" />
                            {formatDateTime(activity.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {enquiry.adminNotes && (
                <>
                  <Separator />
                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold">Internal notes</h3>
                    <p className="whitespace-pre-wrap wrap-break-word rounded-lg bg-muted/40 p-4 text-sm">
                      {enquiry.adminNotes}
                    </p>
                  </section>
                </>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
