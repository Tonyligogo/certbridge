'use client';

import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  LEVEL_OPTIONS,
} from "./catalogue-data";
import {
  useCatalogueSearch,
  useDebouncedQuery,
  type CatalogueSearch,
} from "../hooks/use-catalogue-search";
import type { CourseCategory, CourseAudience } from "../types/catalogue";

interface FilterPanelProps {
  idPrefix?: string;
  categories?: CourseCategory[];
  audiences?: CourseAudience[];
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </legend>
      <div className="space-y-2.5 pt-1">{children}</div>
    </fieldset>
  );
}

function CheckRow({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
      <Label htmlFor={id} className="cursor-pointer text-sm font-normal text-foreground">
        {label}
      </Label>
    </div>
  );
}

export function FilterPanel({
  idPrefix = "flt",
  categories = [],
  audiences = [],
}: FilterPanelProps) {
  const { search, setSearch, toggleIn, clearAll } = useCatalogueSearch();
  const s = search as CatalogueSearch;
  const [draft, setDraft] = useDebouncedQuery(s.q, (next) => setSearch({ q: next }));

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-search`} className="text-sm font-medium">
          Search courses
        </Label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id={`${idPrefix}-search`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Title or keyword…"
            className="pl-9"
          />
        </div>
      </div>

      <Separator />

      {/* Category Filter */}
      {categories.length > 0 && (
        <>
          <Group title="Category">
            {categories.map((c) => (
              <CheckRow
                key={c.id}
                id={`${idPrefix}-cat-${c.id}`}
                label={c.name}
                checked={s.categories.includes(c.id) || s.categories.includes(c.slug)}
                onChange={() => toggleIn("categories", c.id)}
              />
            ))}
          </Group>
          <Separator />
        </>
      )}

      {/* Target Audience Filter */}
      {audiences.length > 0 && (
        <>
          <Group title="Target audience">
            {audiences.map((a) => (
              <CheckRow
                key={a.id}
                id={`${idPrefix}-aud-${a.id}`}
                label={a.name}
                checked={s.audiences.includes(a.id) || s.audiences.includes(a.slug)}
                onChange={() => toggleIn("audiences", a.id)}
              />
            ))}
          </Group>
          <Separator />
        </>
      )}

      {/* Difficulty Level Filter */}
      <Group title="Difficulty level">
        {LEVEL_OPTIONS.map((d) => (
          <CheckRow
            key={d.id}
            id={`${idPrefix}-lvl-${d.id}`}
            label={d.label}
            checked={s.levels.includes(d.id)}
            onChange={() => toggleIn("levels", d.id)}
          />
        ))}
      </Group>

      <Separator />

      {/* Badges & Features Toggles */}
      <Group title="Badges & features">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor={`${idPrefix}-featured`} className="text-sm font-normal">
            Featured courses
          </Label>
          <Switch
            id={`${idPrefix}-featured`}
            checked={s.featured}
            onCheckedChange={(v) => setSearch({ featured: v })}
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor={`${idPrefix}-isPopular`} className="text-sm font-normal">
            Popular courses
          </Label>
          <Switch
            id={`${idPrefix}-isPopular`}
            checked={s.isPopular}
            onCheckedChange={(v) => setSearch({ isPopular: v })}
          />
        </div>
        {/* <div className="flex items-center justify-between gap-3">
          <Label htmlFor={`${idPrefix}-certificate`} className="text-sm font-normal">
            Includes certificate
          </Label>
          <Switch
            id={`${idPrefix}-certificate`}
            checked={true}
            onCheckedChange={(v) => setSearch({ certificateProvided: v })}
          />
        </div> */}
      </Group>

      <Button variant="outline" className="w-full gap-2" onClick={clearAll}>
        <RotateCcw className="size-4" aria-hidden="true" />
        Clear all filters
      </Button>
    </div>
  );
}

export function FilterSidebar({
  categories = [],
  audiences = [],
}: {
  categories?: CourseCategory[];
  audiences?: CourseAudience[];
}) {
  return (
    <aside
      aria-label="Course filters"
      className="sticky top-6 hidden max-h-[calc(100dvh-3rem)] w-72 shrink-0 overflow-y-auto rounded-xl border border-border bg-card p-5 shadow-panel lg:block"
    >
      <h2 className="mb-4 text-sm font-semibold text-foreground">Filters</h2>
      <FilterPanel idPrefix="desktop" categories={categories} audiences={audiences} />
    </aside>
  );
}