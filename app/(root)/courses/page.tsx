'use client';
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { courses } from "@/lib/courses";
import { CourseCard } from "@/components/web/courseCard";

const FORMAT_OPTIONS = ["Online", "On-Site", "Venue"];
const DURATION_BUCKETS = [
  { label: "1 day", test: (d: string) => /^1 day/i.test(d) },
  { label: "2 days", test: (d: string) => /^2 days/i.test(d) },
  { label: "3 days", test: (d: string) => /^3 days/i.test(d) },
  { label: "4+ days", test: (d: string) => /^([4-9]|\d{2,}) days/i.test(d) },
];

export default function CoursesPage() {
  const categories = useMemo(
    () => Array.from(new Set(courses.map((c) => c.category))),
    []
  );

  const [query, setQuery] = useState("");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggle = (
    list: string[],
    setList: (v: string[]) => void,
    value: string
  ) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const clearAll = () => {
    setQuery("");
    setSelectedCats([]);
    setSelectedFormats([]);
    setSelectedDurations([]);
  };

  const filtered = courses.filter((c) => {
    const matchesQ =
      !query ||
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase());
    const matchesCat =
      selectedCats.length === 0 || selectedCats.includes(c.category);
    const matchesFormat =
      selectedFormats.length === 0 ||
      selectedFormats.some((f) => c.format.toLowerCase().includes(f.toLowerCase()));
    const matchesDuration =
      selectedDurations.length === 0 ||
      DURATION_BUCKETS.some(
        (b) => selectedDurations.includes(b.label) && b.test(c.duration)
      );
    return matchesQ && matchesCat && matchesFormat && matchesDuration;
  });

  const activeCount =
    selectedCats.length + selectedFormats.length + selectedDurations.length;

  const FilterPanel = (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-text-primary">Filters</h2>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs font-semibold text-purple-700 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <FilterGroup title="Delivery Format">
        {FORMAT_OPTIONS.map((f) => (
          <CheckboxRow
            key={f}
            label={f}
            checked={selectedFormats.includes(f)}
            onChange={() => toggle(selectedFormats, setSelectedFormats, f)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Duration">
        {DURATION_BUCKETS.map((d) => (
          <CheckboxRow
            key={d.label}
            label={d.label}
            checked={selectedDurations.includes(d.label)}
            onChange={() => toggle(selectedDurations, setSelectedDurations, d.label)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Category">
        {categories.map((c) => (
          <CheckboxRow
            key={c}
            label={c}
            checked={selectedCats.includes(c)}
            onChange={() => toggle(selectedCats, setSelectedCats, c)}
          />
        ))}
      </FilterGroup>
    </div>
  );

  return (
    <>
      <section className="bg-purple-900 text-white py-16 lg:py-20">
        <div className="mx-auto max-w-10/12 px-6 lg:px-10">
          <span className="text-sm font-semibold uppercase tracking-wider text-purple-300">
            Course Catalogue
          </span>
          <h1 className="mt-3 font-display text-4xl lg:text-6xl font-bold max-w-3xl">
            Find the right training for your team
          </h1>
          <p className="mt-5 text-lg text-white/75 max-w-2xl">
            Pick a course and submit a booking request. We&apos;ll match you with a vetted
            trainer and arrange everything end-to-end.
          </p>

          <div className="mt-8 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-green"
            />
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-white">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid lg:grid-cols-[16rem_1fr] gap-10">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block sticky top-24 self-start">
              {FilterPanel}
            </aside>

            <div>
              {/* Mobile controls */}
              <div className="flex items-center justify-between mb-6 lg:mb-8">
                <p className="text-sm text-text-muted">
                  Showing <span className="font-semibold text-text-primary">{filtered.length}</span> of {courses.length} courses
                </p>
                <button
                  onClick={() => setMobileOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-purple-200 text-sm font-semibold text-purple-800"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeCount > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-purple-700 text-white text-xs">
                      {activeCount}
                    </span>
                  )}
                </button>
              </div>

              {filtered.length === 0 ? (
                <p className="text-text-muted">No courses match your filters.</p>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((c) => (
                    <CourseCard key={c.slug} course={c} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile filter drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-white shadow-xl overflow-y-auto p-6">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-md hover:bg-purple-50"
              aria-label="Close filters"
            >
              <X className="h-5 w-5" />
            </button>
            {FilterPanel}
            <button
              onClick={() => setMobileOpen(false)}
              className="mt-8 w-full py-3 rounded-lg bg-accent-green text-white font-semibold"
            >
              Show {filtered.length} courses
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-purple-300 text-purple-700 focus:ring-purple-500 accent-purple-700"
      />
      <span className="text-sm text-text-secondary group-hover:text-text-primary">
        {label}
      </span>
    </label>
  );
}