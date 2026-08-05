"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { DEFAULT_PRICE_MAX } from "../components/catalogue-data";

export const catalogueSearchSchema = z.object({
  q: z.string().default(""),
  categories: z.array(z.string()).default([]),
  audiences: z.array(z.string()).default([]),
  pricing: z.enum(["all", "free", "paid"]).default("all"),
  minPrice: z.coerce.number().default(0),
  maxPrice: z.coerce.number().default(DEFAULT_PRICE_MAX),
  durations: z.array(z.string()).default([]),
  levels: z.array(z.string()).default([]),
  deliveryModes: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  isPopular: z.boolean().default(false),
  certificateProvided: z.boolean().default(false),
  sort: z.string().default("recent"),
  view: z.enum(["grid", "list"]).default("grid"),
});

export type CatalogueSearch = z.infer<typeof catalogueSearchSchema>;

export const DEFAULT_SEARCH: CatalogueSearch = {
  q: "",
  categories: [],
  audiences: [],
  pricing: "all",
  minPrice: 0,
  maxPrice: DEFAULT_PRICE_MAX,
  durations: [],
  levels: [],
  deliveryModes: [],
  featured: false,
  isPopular: false,
  certificateProvided: false,
  sort: "recent",
  view: "grid",
};

export function useCatalogueSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const parseParams = useCallback(
    (params: URLSearchParams): CatalogueSearch => {
      const getArray = (key: string) => {
        const value = params.get(key);
        return value ? value.split(",").filter(Boolean) : [];
      };

      return {
        q: params.get("q") ?? DEFAULT_SEARCH.q,
        categories: getArray("categories"),
        audiences: getArray("audiences"),
        pricing:
          (params.get("pricing") as CatalogueSearch["pricing"]) ??
          DEFAULT_SEARCH.pricing,
        minPrice: params.has("minPrice")
          ? Number(params.get("minPrice"))
          : DEFAULT_SEARCH.minPrice,
        maxPrice: params.has("maxPrice")
          ? Number(params.get("maxPrice"))
          : DEFAULT_SEARCH.maxPrice,
        durations: getArray("durations"),
        levels: getArray("levels"),
        deliveryModes: getArray("deliveryModes"),
        featured: params.get("featured") === "true",
        isPopular: params.get("isPopular") === "true",
        certificateProvided:
          params.get("certificateProvided") === "true",
        sort: params.get("sort") ?? DEFAULT_SEARCH.sort,
        view:
          (params.get("view") as CatalogueSearch["view"]) ??
          DEFAULT_SEARCH.view,
      };
    },
    []
  );

  const search = parseParams(searchParams);

  const setSearch = useCallback(
    (patch: Partial<CatalogueSearch>) => {
      const next = {
        ...search,
        ...patch,
      };

      const params = new URLSearchParams();

      const setArray = (key: string, values: string[]) => {
        if (values.length) {
          params.set(key, values.join(","));
        }
      };

      const setValue = (
        key: string,
        value: string | number | boolean,
        defaultValue: string | number | boolean
      ) => {
        if (
          value !== defaultValue &&
          value !== "" &&
          value !== false
        ) {
          params.set(key, String(value));
        }
      };

      setValue("q", next.q.trim(), "");
      setArray("categories", next.categories);
      setArray("audiences", next.audiences);
      setValue("pricing", next.pricing, "all");
      setValue("minPrice", next.minPrice, 0);
      setValue("maxPrice", next.maxPrice, DEFAULT_PRICE_MAX);
      setArray("durations", next.durations);
      setArray("levels", next.levels);
      setArray("deliveryModes", next.deliveryModes);
      setValue("featured", next.featured, false);
      setValue("isPopular", next.isPopular, false);
      setValue(
        "certificateProvided",
        next.certificateProvided,
        false
      );
      setValue("sort", next.sort, "recent");
      setValue("view", next.view, "grid");

      const query = params.toString();

      router.replace(
        query ? `${pathname}?${query}` : pathname,
        {
          scroll: false,
        }
      );
    },
    [pathname, router, search]
  );

  const toggleIn = useCallback(
    (
      key:
        | "categories"
        | "audiences"
        | "durations"
        | "levels"
        | "deliveryModes",
      value: string
    ) => {
      const current = search[key];

      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      setSearch({
        [key]: next,
      });
    },
    [search, setSearch]
  );

  const clearAll = useCallback(() => {
    setSearch({
      ...DEFAULT_SEARCH,
      view: search.view,
    });
  }, [search.view, setSearch]);

  return {
    search,
    setSearch,
    toggleIn,
    clearAll,
  };
}

export function useDebouncedQuery(
  value: string,
  onCommit: (value: string) => void
) {
  const [draft, setDraft] = useState(value);
  const [previousValue, setPreviousValue] = useState(value);

  // Synchronize during render instead of an effect
  if (value !== previousValue) {
    setPreviousValue(value);
    setDraft(value);
  }

  useEffect(() => {
    if (draft === value) return;

    const timer = setTimeout(() => {
      onCommit(draft);
    }, 300);

    return () => clearTimeout(timer);
  }, [draft, value, onCommit]);

  return [draft, setDraft] as const;
}

export function activeFilterCount(search: CatalogueSearch) {
  let count = 0;

  if (search.q.trim()) count++;

  count += search.categories.length;
  count += search.audiences.length;
  count += search.durations.length;
  count += search.levels.length;
  count += search.deliveryModes.length;

  if (search.pricing !== "all") count++;

  if (
    search.pricing === "paid" &&
    (search.minPrice > 0 ||
      search.maxPrice < DEFAULT_PRICE_MAX)
  ) {
    count++;
  }

  if (search.featured) count++;
  if (search.isPopular) count++;
  if (search.certificateProvided) count++;

  return count;
}