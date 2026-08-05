'use client';

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCatalogueSearch } from "../hooks/use-catalogue-search";
import { SORT_OPTIONS } from "./catalogue-data";

export function CourseSortSelect() {
  const { search, setSearch } = useCatalogueSearch();

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="course-sort" className="sr-only">
        Sort courses
      </Label>
      <Select
        value={search.sort}
        onValueChange={(v) => setSearch({ sort: v })}
      >
        <SelectTrigger id="course-sort" className="w-45">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((o) => (
            <SelectItem key={o.id} value={o.id}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}