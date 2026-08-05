'use client';

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useCatalogueSearch,
  type CatalogueSearch,
} from "../hooks/use-catalogue-search";
import {
    DURATION_BUCKETS,
  LEVEL_OPTIONS,
  DELIVERY_MODE_OPTIONS,
  DEFAULT_PRICE_MAX,
} from "./catalogue-data";
import type { CourseCategory, CourseAudience } from "../types/catalogue";

interface ActiveFilterChipsProps {
  categories?: CourseCategory[];
  audiences?: CourseAudience[];
}

type SingleKeyChip = {
  key: string;
  label: string;
  clear: Partial<CatalogueSearch>;
};

export function ActiveFilterChips({
  categories = [],
  audiences = [],
}: ActiveFilterChipsProps) {
  const { search, setSearch, toggleIn, clearAll } = useCatalogueSearch();
  const s = search as CatalogueSearch;

  const singleChips: SingleKeyChip[] = [];

  // Search Query Chip
  if (s.q?.trim()) {
    singleChips.push({
      key: "q",
      label: `“${s.q.trim()}”`,
      clear: { q: "" },
    });
  }

  // Pricing Filter Chip
  if (s.pricing !== "all") {
    singleChips.push({
      key: "pricing",
      label: s.pricing === "free" ? "Free" : "Paid",
      clear: { pricing: "all", minPrice: 0, maxPrice: DEFAULT_PRICE_MAX },
    });
  }

  // Custom Price Range Chip
  if (
    s.pricing === "paid" &&
    (s.minPrice > 0 || s.maxPrice < DEFAULT_PRICE_MAX)
  ) {
    singleChips.push({
      key: "price-range",
      label: `KES ${s.minPrice.toLocaleString()} – KES ${s.maxPrice.toLocaleString()}`,
      clear: { minPrice: 0, maxPrice: DEFAULT_PRICE_MAX },
    });
  }

  // Feature Toggles
  if (s.featured) {
    singleChips.push({
      key: "featured",
      label: "Featured",
      clear: { featured: false },
    });
  }

  if (s.isPopular) {
    singleChips.push({
      key: "isPopular",
      label: "Popular",
      clear: { isPopular: false },
    });
  }

  if (s.certificateProvided) {
    singleChips.push({
      key: "certificateProvided",
      label: "With certificate",
      clear: { certificateProvided: false },
    });
  }

  // Array / Multi-select list chips
  const listChips = [
    ...s.categories.map((idOrSlug: string) => {
      const match = categories.find(
        (c) => c.id === idOrSlug || c.slug === idOrSlug
      );
      return {
        group: "categories" as const,
        value: idOrSlug,
        label: match?.name ?? idOrSlug,
      };
    }),
    ...s.audiences.map((idOrSlug: string) => {
      const match = audiences.find(
        (a) => a.id === idOrSlug || a.slug === idOrSlug
      );
      return {
        group: "audiences" as const,
        value: idOrSlug,
        label: match?.name ?? idOrSlug,
      };
    }),
    ...s.durations.map((v: string) => ({
      group: "durations" as const,
      value: v,
      label: DURATION_BUCKETS.find((b) => b.id === v)?.label ?? v,
    })),
    ...s.levels.map((v: string) => ({
      group: "levels" as const,
      value: v,
      label: LEVEL_OPTIONS.find((l) => l.id === v)?.label ?? v,
    })),
    ...s.deliveryModes.map((v: string) => ({
      group: "deliveryModes" as const,
      value: v,
      label: DELIVERY_MODE_OPTIONS.find((d) => d.id === v)?.label ?? v,
    })),
  ];

  if (singleChips.length === 0 && listChips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {listChips.map((c) => (
        <ChipButton
          key={`${c.group}-${c.value}`}
          label={c.label}
          onClear={() => toggleIn(c.group, c.value)}
        />
      ))}
      {singleChips.map((c) => (
        <ChipButton
          key={c.key}
          label={c.label}
          onClear={() => setSearch(c.clear)}
        />
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 text-xs hover:text-destructive"
        onClick={clearAll}
      >
        Clear all
      </Button>
    </div>
  );
}

function ChipButton({
  label,
  onClear,
}: {
  label: string;
  onClear: () => void;
}) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-accent py-1 pl-3 pr-1.5 text-xs font-medium text-accent-foreground border border-border">
      <span className="truncate">{label}</span>
      <button
        type="button"
        aria-label={`Remove filter ${label}`}
        onClick={onClear}
        className="flex size-4 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <X className="size-3" aria-hidden="true" />
      </button>
    </span>
  );
}