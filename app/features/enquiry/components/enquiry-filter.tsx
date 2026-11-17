"use client";

import { CalendarDays, RotateCcw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import { getEnquiryDateRange } from "../utils/enquiry-date-range";
import type { EnquiryDatePreset, EnquiryTypeFilter } from "../types";

export interface EnquiryFilterValues {
  search: string;
  type: EnquiryTypeFilter;
  datePreset: EnquiryDatePreset;
  dateFrom: string;
  dateTo: string;
}

interface EnquiryFiltersProps {
  value: EnquiryFilterValues;
  onChange: (value: EnquiryFilterValues) => void;
}

export function EnquiryFilters({
  value,
  onChange,
}: EnquiryFiltersProps) {
  const hasActiveFilters =
    value.search.trim() !== "" ||
    value.type !== "ALL" ||
    value.datePreset !== "ALL";

  function update(patch: Partial<EnquiryFilterValues>) {
    onChange({
      ...value,
      ...patch,
    });
  }

  function handleDatePresetChange(preset: EnquiryDatePreset) {
    if (preset === "CUSTOM") {
      update({
        datePreset: "CUSTOM",
        dateFrom: "",
        dateTo: "",
      });

      return;
    }

    const range = getEnquiryDateRange(preset);

    update({
      datePreset: preset,
      dateFrom: range.dateFrom ?? "",
      dateTo: range.dateTo ?? "",
    });
  }

  function clearFilters() {
    onChange({
      search: "",
      type: "ALL",
      datePreset: "ALL",
      dateFrom: "",
      dateTo: "",
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search */}
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={value.search}
            onChange={(event) =>
              update({ search: event.target.value })
            }
            placeholder="Search enquiries..."
            className="pl-9"
          />
        </div>

        {/* Enquiry type */}
        <Select
          value={value.type}
          onValueChange={(type) =>
            update({ type: type as EnquiryTypeFilter })
          }
        >
          <SelectTrigger className="w-full lg:w-[190px]">
            <SelectValue placeholder="Enquiry type" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All types</SelectItem>
            <SelectItem value="QUOTE">Quotation requests</SelectItem>
            <SelectItem value="GENERAL">General enquiries</SelectItem>
          </SelectContent>
        </Select>

        {/* Date range */}
        <Select
          value={value.datePreset}
          onValueChange={(preset) =>
            handleDatePresetChange(preset as EnquiryDatePreset)
          }
        >
          <SelectTrigger className="w-full lg:w-[190px]">
            <CalendarDays className="size-4 text-muted-foreground" />
            <SelectValue placeholder="Date range" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All time</SelectItem>
            <SelectItem value="TODAY">Today</SelectItem>
            <SelectItem value="LAST_7_DAYS">Last 7 days</SelectItem>
            <SelectItem value="LAST_30_DAYS">Last 30 days</SelectItem>
            <SelectItem value="THIS_MONTH">This month</SelectItem>
            <SelectItem value="LAST_MONTH">Last month</SelectItem>
            <SelectItem value="CUSTOM">Custom range</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear filters */}
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="shrink-0"
          >
            <RotateCcw className="size-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Custom date range */}
      {value.datePreset === "CUSTOM" && (
        <div className="flex flex-col gap-3 rounded-lg border bg-muted/20 p-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              From date
            </label>

            <Input
              type="date"
              value={value.dateFrom}
              max={value.dateTo || undefined}
              onChange={(event) =>
                update({ dateFrom: event.target.value })
              }
            />
          </div>

          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              To date
            </label>

            <Input
              type="date"
              value={value.dateTo}
              min={value.dateFrom || undefined}
              onChange={(event) =>
                update({ dateTo: event.target.value })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}