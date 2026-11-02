"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  EnquiryDatePreset,
  EnquiryStatusFilter,
  EnquiryTypeFilter,
  GetEnquiriesParams,
} from "../types";
import { EnquiryFilters, EnquiryFilterValues } from "./enquiry-filter";
import {
  useAddEnquiryNote,
  useAdminEnquiries,
  useEnquiryDetails,
  useUpdateEnquiry,
} from "../hooks/use-enquiry";
import { EnquiriesTableSkeleton } from "./table-skeleton";
import { EnquiriesTable } from "./table";
import { EnquiryDetailsSheet } from "./enquiry-detail-sheet";
import {
  EnquiryActionDialogs,
  type EnquiryDialogType,
} from "./enquiry-action-dialog";

const STATUS_TABS: {
  value: EnquiryStatusFilter;
  label: string;
}[] = [
  { value: "ALL", label: "All" },
  { value: "NEW", label: "New" },
  { value: "PENDING", label: "Pending follow-up" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "CONVERTED", label: "Converted" },
  { value: "CLOSED", label: "Closed" },
];

const VALID_STATUSES = STATUS_TABS.map((tab) => tab.value);

const VALID_TYPES: EnquiryTypeFilter[] = ["ALL", "QUOTE", "GENERAL"];

const VALID_PRESETS: EnquiryDatePreset[] = [
  "ALL",
  "TODAY",
  "LAST_7_DAYS",
  "LAST_30_DAYS",
  "THIS_MONTH",
  "LAST_MONTH",
  "CUSTOM",
];

function validValue<T extends string>(
  value: string | null,
  allowed: readonly T[],
  fallback: T,
): T {
  return value && allowed.includes(value as T) ? (value as T) : fallback;
}

export function EnquiriesView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawPage = Number(searchParams.get("page") || 1);
  const page = Number.isSafeInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  const status = validValue(searchParams.get("status"), VALID_STATUSES, "ALL");

  const filters: EnquiryFilterValues = {
    search: searchParams.get("search") || "",
    type: validValue(searchParams.get("type"), VALID_TYPES, "ALL"),
    datePreset: validValue(
      searchParams.get("datePreset"),
      VALID_PRESETS,
      "ALL",
    ),
    dateFrom: searchParams.get("dateFrom") || "",
    dateTo: searchParams.get("dateTo") || "",
  };

  const [searchInput, setSearchInput] = useState(filters.search);
  const [activeDialog, setActiveDialog] = useState<EnquiryDialogType>(null);

  const updateEnquiry = useUpdateEnquiry();
  const addNote = useAddEnquiryNote();

  const isSubmitting = updateEnquiry.isPending || addNote.isPending;

  function updateParams(
    patch: Record<string, string | number | undefined>,
    resetPage = true,
  ) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(patch)) {
      if (value === undefined || value === "" || value === "ALL") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    }

    if (resetPage) {
      params.delete("page");
    }

    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  // Debounce search requests.
  useEffect(() => {
    if (searchInput === filters.search) return;

    const timeout = setTimeout(() => {
      updateParams({ search: searchInput });
    }, 400);

    return () => clearTimeout(timeout);
    // URL changes are intentionally handled through the current render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, filters.search]);

  const queryParams: GetEnquiriesParams = {
    page,
    limit: 10,
    search: filters.search || undefined,
    status,
    type: filters.type,
    dateFrom: filters.dateFrom || undefined,
    dateTo: filters.dateTo || undefined,
  };

  const { data, isPending, isError, isFetching, refetch } =
    useAdminEnquiries(queryParams);

  const enquiries = data?.data?.enquiries ?? [];
  const counts = data?.data?.counts;
  const pagination = data?.data?.pagination;

  const selectedEnquiryId = searchParams.get("enquiryId");

  const {
    data: enquiryDetails,
    isPending: isDetailsLoading,
    isError: isDetailsError,
    refetch: refetchDetails,
  } = useEnquiryDetails(selectedEnquiryId);

  function handleFilterChange(next: EnquiryFilterValues) {
    setSearchInput(next.search);

    updateParams({
      type: next.type,
      datePreset: next.datePreset,
      dateFrom: next.dateFrom,
      dateTo: next.dateTo,
    });
  }

  async function handleChangeStatus(
    status: "NEW" | "CONTACTED" | "IN_PROGRESS",
  ) {
    if (!selectedEnquiryId) return;

    try {
      await updateEnquiry.mutateAsync({
        id: selectedEnquiryId,
        input: {
          action: "CHANGE_STATUS",
          status,
        },
      });

      setActiveDialog(null);
    } catch {
      // Mutation hook handles error toast.
    }
  }

  async function handleAddNote(note: string) {
    if (!selectedEnquiryId) return;

    try {
      await addNote.mutateAsync({
        id: selectedEnquiryId,
        input: { note },
      });

      setActiveDialog(null);
    } catch {
      // Mutation hook handles error toast.
    }
  }

  async function handleCloseEnquiry(reason: string) {
    if (!selectedEnquiryId) return;

    try {
      await updateEnquiry.mutateAsync({
        id: selectedEnquiryId,
        input: {
          action: "CLOSE",
          reason,
        },
      });

      setActiveDialog(null);
    } catch {
      // Mutation hook handles error toast.
    }
  }

  async function handleReopenEnquiry() {
    if (!selectedEnquiryId) return;

    try {
      await updateEnquiry.mutateAsync({
        id: selectedEnquiryId,
        input: {
          action: "REOPEN",
        },
      });
    } catch {
      // Mutation hook handles error toast.
    }
  }

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Enquiries
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage quotation requests, customer enquiries, and follow-ups.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 overflow-x-auto border-b">
        {STATUS_TABS.map((tab) => {
          const active = status === tab.value;
          const count = counts?.[tab.value];

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => updateParams({ status: tab.value })}
              className={`relative flex shrink-0 items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors ${
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}

              {count !== undefined && (
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[11px] ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              )}

              {active && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* Search and filters */}
      <EnquiryFilters
        value={{
          ...filters,
          search: searchInput,
        }}
        onChange={handleFilterChange}
      />

      {/* Results */}
      {isPending ? (
        <EnquiriesTableSkeleton />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border py-16 text-center">
          <AlertCircle className="size-7 text-destructive" />

          <div>
            <p className="text-sm font-semibold">Failed to load enquiries</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Please try again.
            </p>
          </div>

          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : (
        <EnquiriesTable
          enquiries={enquiries}
          pagination={pagination}
          isFetching={isFetching}
          onSelect={(enquiry) => {
            updateParams({ enquiryId: enquiry.id }, false);
          }}
          onPageChange={(nextPage) => updateParams({ page: nextPage }, false)}
        />
      )}

      <EnquiryDetailsSheet
        open={selectedEnquiryId !== null}
        onOpenChange={(open) => {
          if (!open) {
            updateParams({ enquiryId: undefined }, false);

            setActiveDialog(null);
          }
        }}
        enquiry={enquiryDetails ?? null}
        isLoading={isDetailsLoading}
        isError={isDetailsError}
        isSubmitting={isSubmitting}
        onRetry={() => void refetchDetails()}
        onStatusChange={() => setActiveDialog("STATUS")}
        onAddNote={() => setActiveDialog("NOTE")}
        onCloseEnquiry={() => setActiveDialog("CLOSE")}
        onReopenEnquiry={() => void handleReopenEnquiry()}
      />

      {enquiryDetails && activeDialog && (
        <EnquiryActionDialogs
          key={`${selectedEnquiryId}-${activeDialog}`}
          type={activeDialog}
          onClose={() => setActiveDialog(null)}
          currentStatus={enquiryDetails.status}
          isSubmitting={isSubmitting}
          onChangeStatus={handleChangeStatus}
          onAddNote={handleAddNote}
          onCloseEnquiry={handleCloseEnquiry}
        />
      )}
    </div>
  );
}
