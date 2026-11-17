"use client";

import { useState } from "react";
import {
  AlertCircle, ArrowRight, ArrowRightLeft, ChevronDown,
  Loader2, MoreHorizontal, Plus, RefreshCw, RotateCcw, XCircle,
} from "lucide-react";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AdminEnquiryDetail, EnquiryStatus } from "../types";
import { EditEnquiryDetails } from "./EditEnquiryDetails";
import { EnquiryOverview } from "./EnquiryOverview";
import { EnquiryActivity } from "./EnquiryActivity";
import { EnquiryQuotations } from "./quotations/EnquiryQuotations";
import Link from "next/link";

interface EnquiryDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enquiry?: AdminEnquiryDetail | null;
  isLoading?: boolean;
  onStatusChange?: () => void;
  onAddNote?: () => void;
  onConvert?: () => void;
  isError?: boolean;
  onRetry?: () => void;
  onReopenEnquiry?: () => void;
  onCloseEnquiry?: () => void;
  isSubmitting?: boolean;
}

type EnquiryTab = "overview" | "quotations" | "activity";
const TABS: { value: EnquiryTab; label: string }[] = [
  { value: "overview", label: "Overview" },
  { value: "quotations", label: "Quotations" },
  { value: "activity", label: "Activity" },
];

const STATUS_LABELS: Record<EnquiryStatus, string> = {
  NEW: "New", CONTACTED: "Contacted", IN_PROGRESS: "In progress",
  CONVERTED: "Converted", CLOSED: "Closed",
};
const STATUS_STYLES: Record<EnquiryStatus, string> = {
  NEW: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900",
  CONTACTED: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-900",
  IN_PROGRESS: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900",
  CONVERTED: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900",
  CLOSED: "bg-muted text-muted-foreground border-border",
};
function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium", timeZone: "Africa/Nairobi",
  }).format(new Date(value));
}
function DetailsSkeleton() {
  return (
    <div className="space-y-5 p-5">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}

export function EnquiryDetailsSheet({
  open, onOpenChange, enquiry, isLoading = false, isError = false,
  onRetry, onStatusChange, onAddNote, onReopenEnquiry,
  onConvert, onCloseEnquiry, isSubmitting,
}: EnquiryDetailsSheetProps) {
  const [activeTab, setActiveTab] = useState<EnquiryTab>("overview");
  const [isEditing, setIsEditing] = useState(false);
  const isConverted = enquiry?.status === "CONVERTED";
  const isClosed = enquiry?.status === "CLOSED";
  const canEdit = !isConverted && !isClosed;

  const changeTab = (tab: EnquiryTab) => {
    setIsEditing(false);
    setActiveTab(tab);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-170">
        <div className="shrink-0 border-b bg-background">
          <SheetHeader className="gap-3 px-5 py-5 pr-12">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {enquiry?.type === "GENERAL" ? "General enquiry" : "Quotation request"}
              </p>
              <SheetTitle className="text-xl font-semibold tracking-tight">
                {enquiry?.reference ?? "Enquiry details"}
              </SheetTitle>
              <SheetDescription className="flex flex-wrap items-center gap-2">
                {enquiry ? (
                  <>
                    <Badge variant="outline" className={STATUS_STYLES[enquiry.status]}>
                      {STATUS_LABELS[enquiry.status]}
                    </Badge>
                    <span>Received {formatDate(enquiry.createdAt)}</span>
                  </>
                ) : "Customer request and activity history"}
              </SheetDescription>
            </div>
          </SheetHeader>
          <div className="flex flex-wrap items-center gap-2 px-5 pb-4">
            {isConverted && enquiry?.bookingId ? (
              <Button asChild>
              <Link href={`/admin/bookings/${enquiry.bookingId}`}>
                View booking <ArrowRight/>
              </Link>
              </Button>
            ) : isClosed ? (
              <Button size="sm" variant="outline" onClick={onReopenEnquiry}
                disabled={!onReopenEnquiry || isSubmitting}>
                {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <RotateCcw className="size-4" />}
                Reopen enquiry
              </Button>
            ) : !isConverted ? (
              <Button size="sm" onClick={onConvert} disabled={!enquiry || isLoading || !onConvert}>
                <ArrowRightLeft className="size-4" /> Convert to booking
              </Button>
            ) : null}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" disabled={!enquiry || isLoading}
                  aria-label="More enquiry actions">
                  <MoreHorizontal className="size-4" /><ChevronDown className="size-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onSelect={onAddNote} disabled={!onAddNote}>
                  <Plus className="size-4" /> Add internal note
                </DropdownMenuItem>
                {canEdit && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={onStatusChange} disabled={!onStatusChange}>
                      <RefreshCw className="size-4" /> Change status
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={onCloseEnquiry} disabled={!onCloseEnquiry}
                      className="text-destructive focus:text-destructive">
                      <XCircle className="size-4" /> Close enquiry
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div role="tablist" aria-label="Enquiry sections"
            className="flex gap-1 overflow-x-auto px-5">
            {TABS.map((tab) => (
              <button key={tab.value} type="button" role="tab"
                id={`enquiry-tab-${tab.value}`}
                aria-controls={`enquiry-panel-${tab.value}`}
                aria-selected={activeTab === tab.value}
                disabled={!enquiry || isLoading || isError}
                onClick={() => changeTab(tab.value)}
                className={`shrink-0 border-b-2 px-3 py-3 text-sm font-medium transition-colors
                  ${activeTab === tab.value
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto" role="tabpanel"
          id={`enquiry-panel-${activeTab}`}
          aria-labelledby={`enquiry-tab-${activeTab}`}>
          {isError ? (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-20 text-center">
              <AlertCircle className="size-7 text-destructive" />
              <div className="space-y-1">
                <p className="text-sm font-semibold">Unable to load enquiry</p>
                <p className="text-sm text-muted-foreground">We couldn&apos;t retrieve the enquiry details.</p>
              </div>
              <Button variant="outline" size="sm" onClick={onRetry}>Try again</Button>
            </div>
          ) : isLoading || !enquiry ? (
            <DetailsSkeleton />
          ) : activeTab === "overview" ? (
            isEditing ? (
              <EditEnquiryDetails enquiry={enquiry}
                onCancel={() => setIsEditing(false)}
                onSuccess={() => setIsEditing(false)} />
            ) : (
              <EnquiryOverview enquiry={enquiry} canEdit={canEdit}
                onEdit={() => setIsEditing(true)} />
            )
          ) : activeTab === "activity" ? (
            <EnquiryActivity enquiry={enquiry} onAddNote={onAddNote} />
          ) : (
            <EnquiryQuotations key={enquiry.id} enquiry={enquiry} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
