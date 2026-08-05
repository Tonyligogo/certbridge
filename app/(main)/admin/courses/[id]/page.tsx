'use client';
import {
  Award,
  BadgeCheck,
  BookOpen,
  Building2,
  CircleDollarSign,
  Flame,
  Image as ImageIcon,
  LayoutList,
  Plus,
  Save,
  Send,
  Sparkles,
  Star,
  Wand2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { EmptyState, ErrorText, FieldLabel, SectionCard } from "../../components/course/SectionCard";
import { AudienceMultiSelect } from "../../components/course/AudienceMultiSelect";
import { ThumbnailDropzone } from "../../components/course/ThumbnailDropzone";
import { PricingSection } from "../../components/course/PricingSection";
import { SyllabusModules } from "../../components/course/SyllabusModules";
import { RichTextEditor } from "../../components/course/Editor";
import {
  AUDIENCES,
  CATEGORIES,
  COURSE_STATUSES,
  DIFFICULTY_LABELS,
  DIFFICULTY_LEVELS,
  DELIVERY_MODE_LABELS,
  countWords,
  slugify,
  DeliveryMode,
  uid,
} from "../../components/course/schema";
import { toast } from "sonner";
import { useCreateCourse } from "@/hooks/course/use-course";
import { CreateCourseInput } from "@/lib/validation/course";
import { Chip } from "../../components/course/Chip";
import { SummaryRow } from "../../components/course/SummaryRow";
import { ToggleTile } from "../../components/course/ToggleTile";
import { StatusPill } from "../../components/course/StatusPill";
import { CreateCategoryDialog } from "../../components/course/CreateCategoryDialog";
import { useCourseCategories } from "@/hooks/course-category/use-course-category";
import { CreateAudienceDialog } from "../../components/course/CreateAudienceDialog";
import { useCourseAudiences } from "@/hooks/course-audience/use-course-audience";

const MAX_SHORT_WORDS = 250;

export type CourseForm = {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  durationDays: number;

  level: CreateCourseInput["level"];
  status: CreateCourseInput["status"];

  featured: boolean;
  isPopular: boolean;
  certificateProvided: boolean;

  thumbnailUrl: string;

  categoryId: string;

  audiences: string[];

  pricing: {
    id: string;
    deliveryMode: DeliveryMode;
    amount: string;
    currency: string;
  };

  modules: {
    id: string;
    title: string;
    description: string;
    estimatedDuration: number;
  }[];
};

const initialForm: CourseForm = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  durationDays: 0,
  level: "BEGINNER",
  status: "DRAFT",
  featured: false,
  isPopular: false,
  certificateProvided: true,
  thumbnailUrl: "",
  categoryId: "",
  audiences: [],
  pricing: {
    id: uid(),
    deliveryMode: "ONLINE",
    amount: "",
    currency: "KES",
  },
  modules: [],
};

type Errors = Partial<Record<keyof CourseForm, string>> & { pricingIds?: string[] };

export default function NewCoursePage() {
  const [form, setForm] = useState<CourseForm>(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const {mutate:createCourse} = useCreateCourse();
  const { data: courseCategories } = useCourseCategories();
  const { data: courseAudiences } = useCourseAudiences();

  const set = <K extends keyof CourseForm>(key: K, value: CourseForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const shortWords = countWords(form.shortDescription);

const patchPricing = (patch: Partial<CourseForm["pricing"]>) =>
  set("pricing", {
    ...form.pricing,
    ...patch,
  });

  const addModule = () =>
    set("modules", [
      ...form.modules,
      { id: uid(), title: "", estimatedDuration: 0, description: "" },
    ]);

  const patchModule = (id: string, patch: Partial<CourseForm["modules"][number]>) =>
    set(
      "modules",
      form.modules.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    );

  const removeModule = (id: string) =>
    set(
      "modules",
      form.modules.filter((m) => m.id !== id),
    );

  const reorderModules = (from: number, to: number) => {
    const next = [...form.modules];
    const [moved] = next.splice(from, 1);
    if (!moved) return;
    next.splice(to, 0, moved);
    set("modules", next);
  };

  const totalMinutes = useMemo(
    () => form.modules.reduce((sum, m) => sum + (Number(m.estimatedDuration) || 0), 0),
    [form.modules],
  );

  const completion = useMemo(() => {
    const checks = [
      Boolean(form.title.trim()),
      Boolean(form.slug.trim()),
      Boolean(form.shortDescription.trim()),
      Boolean(form.description.trim()),
      Boolean(form.durationDays),
      Boolean(form.categoryId),
      form.audiences.length > 0,
      Boolean(form.pricing.amount),
  Boolean(form.pricing.currency.trim()),
  Boolean(form.pricing.deliveryMode),
      form.modules.length > 0,
      Boolean(form.thumbnailUrl),
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [form]);

  const validate = () => {
    const next: Errors = {};
    if (!form.title.trim()) next.title = "Course title is required.";
    if (!form.slug.trim()) next.slug = "Slug is required — generate it from the title.";
    if (!form.shortDescription.trim()) next.shortDescription = "Short description is required.";
    else if (shortWords > MAX_SHORT_WORDS)
      next.shortDescription = `Short description must be under ${MAX_SHORT_WORDS} words.`;
    if (!form.description.trim()) next.description = "A full course overview is required.";
    if (!form.durationDays || Number(form.durationDays) <= 0)
      next.durationDays = "Enter a duration of at least 1 day.";
    if (!form.categoryId) next.categoryId = "Select a course category.";
    if (form.audiences.length === 0) next.audiences = "Select at least one target audience.";
    if (
  !form.pricing.amount ||
  !form.pricing.currency.trim() ||
  !form.pricing.deliveryMode
) {
  next.pricing = "Please complete the pricing information.";
}
    if (form.modules.length === 0) next.modules = "Add at least one syllabus module.";
    else if (form.modules.some((m) => !m.title.trim()))
      next.modules = "Every module needs a title.";
    setErrors(next);
    return Object.keys(next).filter((k) => next[k as keyof Errors]).length === 0;
  };

  const saveDraft = () => {
    set("status", "DRAFT");
    toast.success("Draft saved", {
      description: `“${form.title.trim() || "Untitled course"}” stored as DRAFT.`,
    });
  };

  const publish = () => {
    if (!validate()) {
      toast.error("Cannot publish yet", {
        description: "Resolve the highlighted fields before publishing.",
      });
      document
        .querySelector(".field-error, [data-invalid='true']")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    set("status", "PUBLISHED");
    
    const payload: CreateCourseInput = {
  ...form,

  durationDays: Number(form.durationDays),

  pricing: {
    ...form.pricing,
    amount: Number(form.pricing.amount),
  },

  modules: form.modules.map((m) => ({
    title: m.title,
    description: m.description,
    estimatedDuration: m.estimatedDuration
      ? Number(m.estimatedDuration)
      : undefined,
  })),
};
  createCourse(payload, {
    onSuccess: () => {
      toast.success("Course published", {
      description: `“${form.title}” is now live in the CertBridge catalogue.`,
    });
    },
    onError: () => {
      toast.error("Failed to publish course", {
      description: `“${form.title}” could not be published. Please try again.`,
    });
    }
  });
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h1 className="mt-1 text-3xl font-semibold text-foreground">Create a new course</h1>
            <StatusPill status={form.status} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Left column: form */}
          <div className="space-y-6">
            <SectionCard
              icon={BookOpen}
              step="Section 01"
              title="Core details"
              description="Identity, positioning and delivery length of the programme."
            >
              <div className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor="title" required>
                      Course title
                    </FieldLabel>
                    <Input
                      id="title"
                      value={form.title}
                      placeholder="Advanced Occupational Safety Leadership"
                      onChange={(e) => set("title", e.target.value)}
                      className={cn(errors.title && "field-error")}
                    />
                    <ErrorText>{errors.title}</ErrorText>
                  </div>
                  <div>
                    <FieldLabel htmlFor="slug" required>
                      Slug
                    </FieldLabel>
                    <div className="flex gap-2">
                      <Input
                        id="slug"
                        value={form.slug}
                        placeholder="advanced-occupational-safety-leadership"
                        onChange={(e) => set("slug", slugify(e.target.value))}
                        className={cn("font-mono text-sm", errors.slug && "field-error")}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => set("slug", slugify(form.title))}
                        // disabled={!form.title.trim()}
                      >
                        <Wand2 className="size-4" /> Generate
                      </Button>
                    </div>
                    <ErrorText>{errors.slug}</ErrorText>
                  </div>
                </div>

                <div>
                  <FieldLabel
                    htmlFor="shortDescription"
                    required
                    hint={
                      <span
                        className={cn(
                          shortWords > MAX_SHORT_WORDS && "font-semibold text-destructive",
                        )}
                      >
                        {shortWords} / {MAX_SHORT_WORDS} words
                      </span>
                    }
                  >
                    Short description
                  </FieldLabel>
                  <Textarea
                    id="shortDescription"
                    rows={3}
                    value={form.shortDescription}
                    placeholder="A concise summary shown on catalogue cards and search results."
                    onChange={(e) => set("shortDescription", e.target.value)}
                    className={cn(errors.shortDescription && "field-error")}
                  />
                  <ErrorText>{errors.shortDescription}</ErrorText>
                </div>

                <div>
                  <FieldLabel htmlFor="description" required>
                    Full description
                  </FieldLabel>
                  <RichTextEditor
                    id="description"
                    value={form.description}
                    onChange={(v) => set("description", v)}
                    invalid={Boolean(errors.description)}
                  />
                  <ErrorText>{errors.description}</ErrorText>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor="duration" required>
                      Duration in days
                    </FieldLabel>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={form.durationDays}
                      placeholder="5"
                      onChange={(e) => set("durationDays", Number(e.target.value))}
                      className={cn("tabular-nums", errors.durationDays && "field-error")}
                    />
                    <ErrorText>{errors.durationDays}</ErrorText>
                  </div>
                  <div>
                    <FieldLabel>Status</FieldLabel>
                    <div className="flex rounded-lg border border-input bg-surface p-1">
                      {COURSE_STATUSES.map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => set("status", status)}
                          className={cn(
                            "flex-1 rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
                            form.status === status
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <FieldLabel>Difficulty level</FieldLabel>
                  <ToggleGroup
                    type="single"
                    value={form.level}
                    onValueChange={(v) => v && set("level", v as CourseForm["level"])}
                    className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4"
                  >
                    {DIFFICULTY_LEVELS.map((level) => (
                      <ToggleGroupItem
                        key={level}
                        value={level}
                        className="rounded-lg border border-input bg-surface py-2 text-xs font-semibold uppercase tracking-wide data-[state=on]:border-primary data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                      >
                        {DIFFICULTY_LABELS[level]}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              icon={Sparkles}
              step="Section 02"
              title="Metrics & badges"
              description="Merchandising flags and the catalogue thumbnail."
            >
              <div className="grid gap-4 md:grid-cols-3">
                <ToggleTile
                  icon={Star}
                  label="Featured course"
                  hint="Pinned to the homepage rail"
                  checked={form.featured}
                  onCheckedChange={(v) => set("featured", v)}
                />
                <ToggleTile
                  icon={Flame}
                  label="Popular course"
                  hint="Shown with a demand badge"
                  checked={form.isPopular}
                  onCheckedChange={(v) => set("isPopular", v)}
                />
                <ToggleTile
                  icon={Award}
                  label="Certificate provided"
                  hint="Issues a verifiable certificate"
                  checked={form.certificateProvided}
                  onCheckedChange={(v) => set("certificateProvided", v)}
                />
              </div>

              <Separator className="my-6" />

              <FieldLabel>
                <span className="inline-flex items-center gap-2">
                  <ImageIcon className="size-4 text-muted-foreground" /> Thumbnail image
                </span>
              </FieldLabel>
              <ThumbnailDropzone
                value={form.thumbnailUrl}
                onChange={(v) => set("thumbnailUrl", v)}
              />
            </SectionCard>

            <SectionCard
              icon={Building2}
              step="Section 03"
              title="Category & audience"
              description="Relations to the training sector and learner segments."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <FieldLabel required>Course category</FieldLabel>
                  <div className="flex gap-2 items-center">
                    <Select
                      value={form.categoryId}
                      onValueChange={(v) => set("categoryId", v)}
                    >
                      <SelectTrigger
                        data-invalid={Boolean(errors.categoryId)}
                        className={cn("w-full", errors.categoryId && "field-error")}
                      >
                        <SelectValue placeholder="Select a training sector" />
                      </SelectTrigger>
                      <SelectContent>
                        {courseCategories && courseCategories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <CreateCategoryDialog
                      existingCategories={courseCategories ?? []}
                      onCreated={(newCat) => {
                        set("categoryId", newCat.id); // Auto-select the newly created category
                      }}
                      trigger={
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label="Add new category"
                        >
                          <Plus className="size-4" />
                        </Button>
                      }
                    />
                  </div>
                  <ErrorText>{errors.categoryId}</ErrorText>
                </div>
                <div>
                  <FieldLabel required>Target audiences</FieldLabel>
                  <div>
                    <AudienceMultiSelect
                      value={form.audiences}
                      onChange={(v) => set("audiences", v)}
                      invalid={Boolean(errors.audiences)}
                      audiences={courseAudiences ?? []}
                    />
                     <CreateAudienceDialog
                      existingAudiences={courseAudiences ?? []}
                      onCreated={(newAudience) => {
                        set("audiences", [...form.audiences, newAudience.id]); // Auto-select the newly created audience
                      }}
                      trigger={
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label="Add new category"
                        >
                          <Plus className="size-4" />
                        </Button>
                      }
                    />

                  </div>
                  <ErrorText>{errors.audiences}</ErrorText>
                </div>
              </div>
            </SectionCard>

            <SectionCard
  icon={CircleDollarSign}
  step="Section 04"
  title="Pricing"
  description="Configure the pricing for this course."
>
  <PricingSection
    pricing={form.pricing}
    onChange={patchPricing}
  />
  <ErrorText>{errors.pricing}</ErrorText>
</SectionCard>

            <SectionCard
              icon={LayoutList}
              step="Section 05"
              title="Syllabus modules"
              description="Drag to reorder the learner journey."
              action={
                form.modules.length > 0 ? (
                  <Button type="button" variant="outline" size="sm" onClick={addModule}>
                    <Plus className="size-4" /> Add Module
                  </Button>
                ) : undefined
              }
            >
              <SyllabusModules
                modules={form.modules}
                onPatch={patchModule}
                onRemove={removeModule}
                onReorder={reorderModules}
                onAdd={addModule}
              />
              <ErrorText>{errors.modules}</ErrorText>
            </SectionCard>
          </div>

          {/* Right column: summary */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="panel overflow-hidden">
              <div className="border-b border-border bg-surface px-5 py-4">
                <h2 className="text-sm font-semibold text-foreground">Course summary</h2>
                <p className="text-xs text-muted-foreground">Live preview of the payload</p>
              </div>
              <div className="space-y-4 p-5">
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-medium text-muted-foreground">Completion</span>
                    <span className="font-semibold text-foreground">{completion}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-surface p-3">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {form.title || "Untitled course"}
                  </p>
                  <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
                    /{form.slug || "course-slug"}
                  </p>
                </div>

                <SummaryRow
                  label="Category"
                  value={
                    CATEGORIES.find((c) => c.id === form.categoryId)?.name ?? "Not selected"
                  }
                />
                <SummaryRow label="Level" value={DIFFICULTY_LABELS[form.level]} />
                <SummaryRow
                  label="Duration"
                  value={form.durationDays ? `${form.durationDays} day(s)` : "—"}
                />
                <SummaryRow
                  label="Audiences"
                  value={
                    form.audiences.length
                      ? form.audiences
                          .map((id) => AUDIENCES.find((a) => a.id === id)?.name)
                          .filter(Boolean)
                          .join(", ")
                      : "None"
                  }
                />
                <SummaryRow
                  label="Modules"
                  value={`${form.modules.length} · ${totalMinutes} min`}
                />

                <Separator />

                <div>
  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
    Pricing
  </p>

  <div className="flex items-center justify-between text-xs">
    <span className="text-muted-foreground">
      {form.pricing.deliveryMode
        ? DELIVERY_MODE_LABELS[form.pricing.deliveryMode]
        : "No delivery mode"}
    </span>

    <span className="font-semibold tabular-nums text-foreground">
      {form.pricing.currency || "KES"} {form.pricing.amount || "0.00"}
    </span>
  </div>
</div>

                <div className="flex flex-wrap gap-1.5">
                  {form.featured ? <Chip icon={Star}>Featured</Chip> : null}
                  {form.isPopular ? <Chip icon={Flame}>Popular</Chip> : null}
                  {form.certificateProvided ? <Chip icon={BadgeCheck}>Certificate</Chip> : null}
                </div>
              </div>
            </div>

            {form.modules.length === 0 ? (
              <div className="mt-4">
                <EmptyState
                  icon={Sparkles}
                  title="Nothing configured yet"
                  description="Add pricing tiers and syllabus modules to complete the course record."
                />
              </div>
            ) : null}
          </aside>
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <p className="text-xs text-muted-foreground">
            {completion}% complete · autosaved locally ·{" "}
            <span className="font-medium text-foreground">{form.status}</span>
          </p>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={saveDraft}>
              <Save className="size-4" /> Save Draft
            </Button>
            <Button type="button" onClick={publish}>
              <Send className="size-4" /> Publish Course
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

