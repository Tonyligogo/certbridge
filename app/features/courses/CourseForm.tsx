"use client";
import {
  Award,
  BadgeCheck,
  BookOpen,
  Building2,
  CircleDollarSign,
  Flame,
  LayoutList,
  Plus,
  Save,
  Send,
  Sparkles,
  Star,
  Wand2,
  ArrowUp,
  ArrowDown,
  Trash2,
  GraduationCap,
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
import {
  EmptyState,
  ErrorText,
  FieldLabel,
  SectionCard,
} from "./SectionCard";
import {
  DIFFICULTY_LABELS,
  DIFFICULTY_LEVELS,
  DELIVERY_MODE_LABELS,
  countWords,
  slugify,
  uid,
} from "./schema";
import { toast } from "sonner";
import type { CreateCourseInput } from "@/lib/validation/course";
import { ToggleTile } from "./ToggleTile";
import { StatusPill } from "./StatusPill";
import { CreateCategoryDialog } from "./CreateCategoryDialog";
import { useCourseCategories } from "@/hooks/course-category/use-course-category";
import { CreateAudienceDialog } from "./CreateAudienceDialog";
import { useCourseAudiences } from "@/hooks/course-audience/use-course-audience";
import { AudienceMultiSelect } from "./AudienceMultiSelect";
import { SummaryRow } from "./SummaryRow";
import { Chip } from "./Chip";
import dynamic from "next/dynamic";
import { CourseLevel, CourseStatus, DeliveryMode } from "@/generated/prisma/enums";
const MAX_SHORT_WORDS = 300;
const DELIVERY_MODES = [DeliveryMode.ARRANGED_VENUE, DeliveryMode.CLIENT_SITE, DeliveryMode.ONLINE] as const;
const makePricing = (pricing: CoursePricingFormType[] = []): CoursePricingFormType[] =>
  DELIVERY_MODES.map((deliveryMode) => {
    const existing = pricing.find((p) => p.deliveryMode === deliveryMode);
    return existing ?? { deliveryMode, amount: "", currency: "KES" };
  });
const RichTextEditor = dynamic(
  () => import("@/app/features/courses/RichTextEditor"),
  { ssr: false}
);
export interface CoursePricingFormType {
  id?: string;
  deliveryMode: DeliveryMode;
  amount: string;
  currency: string;
}
export interface CourseModuleFormType {
  id?: string;
  title: string;
  topics: string[];
  estimatedDuration: number | null;
}
export interface CourseFormType {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  learningOutcomes: string[];
  durationDays: number;
  level: CourseLevel;
  status: CourseStatus;
  featured: boolean;
  isPopular: boolean;
  certificateProvided: boolean;
  thumbnailUrl: string;
  categoryId: string;
  audiences: string[];
  pricing: CoursePricingFormType[];
  modules: CourseModuleFormType[];
}
export const defaultInitialForm: CourseFormType = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  learningOutcomes: [],
  durationDays: 0,
  level: "BEGINNER",
  status: "DRAFT",
  featured: false,
  isPopular: false,
  certificateProvided: true,
  thumbnailUrl: "",
  categoryId: "",
  audiences: [],
  pricing: makePricing(),
  modules: [],
};
type Errors = Partial<Record<keyof CourseFormType, string>> & {
};
interface CourseFormProps {
  initialData?: CourseFormType;
  onSubmit: (payload: CreateCourseInput, status: CreateCourseInput["status"]) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
}
export function CourseForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  submitButtonText,
}: CourseFormProps) {
  const [form, setForm] = useState<CourseFormType>(() => ({
    ...(initialData ?? defaultInitialForm),
    pricing: makePricing(initialData?.pricing),
  }));
  const [errors, setErrors] = useState<Errors>({});
  const { data: courseCategories } = useCourseCategories();
  const { data: courseAudiences } = useCourseAudiences();
  const isEditing = Boolean(initialData);
  const set = <K extends keyof CourseFormType>(key: K, value: CourseFormType[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };
  const shortWords = countWords(form.shortDescription);

  const patchPricing = (mode: DeliveryMode, patch: Partial<CoursePricingFormType>) =>
    set("pricing", form.pricing.map((p) =>
      p.deliveryMode === mode ? { ...p, ...patch, deliveryMode: mode } : p
    ));

  const addModule = () =>
    set("modules", [
      ...form.modules,
      { id: uid(), title: "", estimatedDuration: null, topics: [] },
    ]);

  const patchModule = (
    id: string,
    patch: Partial<CourseFormType["modules"][number]>
  ) =>
    set(
      "modules",
      form.modules.map((m) => (m.id === id ? { ...m, ...patch } : m))
    );

  const removeModule = (id: string) =>
    set(
      "modules",
      form.modules.filter((m) => m.id !== id)
    );

  const reorderModules = (from: number, to: number) => {
    const next = [...form.modules];
    const [moved] = next.splice(from, 1);
    if (!moved) return;
    next.splice(to, 0, moved);
    set("modules", next);
  };

  const totalMinutes = useMemo(
    () =>
      form.modules.reduce(
        (sum, m) => sum + (Number(m.estimatedDuration) || 0),
        0
      ),
    [form.modules]
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
      DELIVERY_MODES.every((mode) => {
        const p = form.pricing.find((p) => p.deliveryMode === mode);
        return p && p.amount.trim() !== "" && Number.isFinite(Number(p.amount)) && Number(p.amount) >= 0 && p.currency === "KES";
      }),
      form.learningOutcomes.length > 0 && form.learningOutcomes.every((outcome) => outcome.trim().length >= 3),
      form.modules.length > 0,
      Boolean(form.thumbnailUrl),
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [form]);

  const validate = () => {
    const next: Errors = {};
    if (!form.title.trim()) next.title = "Course title is required.";
    if (!form.slug.trim())
      next.slug = "Slug is required — generate it from the title.";
    if (!form.shortDescription.trim())
      next.shortDescription = "Short description is required.";
    else if (shortWords > MAX_SHORT_WORDS)
      next.shortDescription = `Short description must be under ${MAX_SHORT_WORDS} words.`;
    if (!form.description.trim())
      next.description = "A full course overview is required.";
    if (!form.durationDays || Number(form.durationDays) <= 0)
      next.durationDays = "Enter a duration of at least 1 day.";
    if (!form.categoryId) next.categoryId = "Select a course category.";
    if (form.audiences.length === 0)
      next.audiences = "Select at least one target audience.";
    if (form.learningOutcomes.length === 0) {
      next.learningOutcomes = "Add at least one learning outcome.";
    } else if (
      form.learningOutcomes.some((outcome) => outcome.trim().length < 3)
    ) {
      next.learningOutcomes =
        "Every learning outcome must contain at least 3 characters.";
    } else if (
      form.learningOutcomes.some((outcome) => outcome.trim().length > 500)
    ) {
      next.learningOutcomes =
        "Learning outcomes cannot exceed 500 characters each.";
    }
    if (form.pricing.length !== DELIVERY_MODES.length ||
      new Set(form.pricing.map((p) => p.deliveryMode)).size !== DELIVERY_MODES.length ||
      DELIVERY_MODES.some((mode) => {
        const p = form.pricing.find((p) => p.deliveryMode === mode);
        return !p || p.amount.trim() === "" || !Number.isFinite(Number(p.amount)) ||
          Number(p.amount) < 0 || p.currency !== "KES";
      })) {
      next.pricing = "Enter a valid KES price for all three delivery modes.";
    }
    if (form.modules.length === 0)
      next.modules = "Add at least one syllabus module.";
    else if (form.modules.some((m) => !m.title.trim() || m.topics.some((t) => !t.trim())))
      next.modules = "Every module needs a title and valid topics.";
    setErrors(next);
    return (
      Object.keys(next).filter((k) => next[k as keyof Errors]).length === 0
    );
  };
  const handleSaveDraft = () => {
    const nextStatus = "DRAFT";
    set("status", nextStatus);
    const payload: CreateCourseInput = buildPayload(nextStatus);
    onSubmit(payload, nextStatus);
  };
  const handlePublishOrUpdate = () => {
    if (!validate()) {
      toast.error("Validation failed", {
        description: "Resolve the highlighted fields before saving.",
      });
      document
        .querySelector(".field-error, [data-invalid='true']")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const nextStatus = isEditing ? form.status : "PUBLISHED";
    set("status", nextStatus);
    const payload: CreateCourseInput = buildPayload(nextStatus);
    onSubmit(payload, nextStatus);
  };
  const buildPayload = (targetStatus: CreateCourseInput["status"]): CreateCourseInput => ({
    ...form,
    status: targetStatus,
    durationDays: Number(form.durationDays),
    learningOutcomes: form.learningOutcomes.map((outcome) =>
    outcome.trim()
  ),
    pricing: form.pricing.map((p) => ({
      deliveryMode: p.deliveryMode,
      amount: p.amount.trim() === "" ? 0 : Number(p.amount),
      currency: p.currency,
    })),
    modules: form.modules.map((m) => ({
      ...(module.id && !module.id.startsWith("temp-")
        ? { id: m.id }
        : {}),
      title: m.title.trim(),
      topics: m.topics.map((t) => t.trim()).filter(Boolean),
      estimatedDuration: m.estimatedDuration || null,
    })),
  });
  return (
    <div className="min-h-screen pb-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h1 className="mt-1 text-3xl font-semibold text-foreground">
            {isEditing ? "Edit Course" : "Create a new course"}
          </h1>
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
                        className={cn(
                          "font-mono text-sm",
                          errors.slug && "field-error"
                        )}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => set("slug", slugify(form.title))}
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
                          shortWords > MAX_SHORT_WORDS &&
                            "font-semibold text-destructive"
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
                    
                    defaultValue={form.description ? JSON.parse(form.description) : []}
                    onChange={(v) => set("description", v)}
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
                      onChange={(e) =>
                        set("durationDays", Number(e.target.value))
                      }
                      className={cn(
                        "tabular-nums",
                        errors.durationDays && "field-error"
                      )}
                    />
                    <ErrorText>{errors.durationDays}</ErrorText>
                  </div>
                  {/* <div>
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
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div> */}
                </div>
                <div>
                  <FieldLabel>Difficulty level</FieldLabel>
                  <ToggleGroup
                    type="single"
                    value={form.level}
                    onValueChange={(v) =>
                      v && set("level", v as CourseFormType["level"])
                    }
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
  icon={GraduationCap}
  step="Section 02"
  title="Learning outcomes"
  description="Describe the skills and knowledge participants will gain."
>
  <div className="space-y-3">
    {form.learningOutcomes.map((outcome, index) => (
      <div key={index} className="flex items-center gap-2">
        <span className="w-6 shrink-0 text-sm text-muted-foreground">
          {index + 1}.
        </span>

        <Input
          value={outcome}
          placeholder="e.g. Apply effective project planning techniques"
          onChange={(e) => {
            const next = [...form.learningOutcomes];
            next[index] = e.target.value;
            set("learningOutcomes", next);
          }}
        />

        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={`Remove outcome ${index + 1}`}
          onClick={() =>
            set(
              "learningOutcomes",
              form.learningOutcomes.filter((_, i) => i !== index)
            )
          }
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    ))}

    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() =>
        set("learningOutcomes", [...form.learningOutcomes, ""])
      }
    >
      <Plus className="size-4" />
      Add learning outcome
    </Button>

    <ErrorText>{errors.learningOutcomes}</ErrorText>
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
              {/* <FieldLabel>
                <span className="inline-flex items-center gap-2">
                  <ImageIcon className="size-4 text-muted-foreground" />{" "}
                  Thumbnail image
                </span>
              </FieldLabel>
              <ThumbnailDropzone
                value={form.thumbnailUrl ?? ""}
                onChange={(v) => set("thumbnailUrl", v)}
              /> */}
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
                        className={cn(
                          "w-full",
                          errors.categoryId && "field-error"
                        )}
                      >
                        <SelectValue placeholder="Select a training sector" />
                      </SelectTrigger>
                      <SelectContent>
                        {courseCategories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <CreateCategoryDialog
                      existingCategories={courseCategories ?? []}
                      onCreated={(newCat) => {
                        set("categoryId", newCat.id);
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
                  <div className="flex gap-2 items-center">
                    <AudienceMultiSelect
                      value={form.audiences}
                      onChange={(v) => set("audiences", v)}
                      invalid={Boolean(errors.audiences)}
                      audiences={courseAudiences ?? []}
                    />
                    <CreateAudienceDialog
                      existingAudiences={courseAudiences ?? []}
                      onCreated={(newAudience) => {
                        set("audiences", [...form.audiences, newAudience.id]);
                      }}
                      trigger={
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label="Add new audience"
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
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter the complete course price for <strong>one participant</strong>,
                  inclusive of costs for the selected delivery mode and entire course duration.
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                  {DELIVERY_MODES.map((mode) => {
                    const price = form.pricing.find((p) => p.deliveryMode === mode);
                    return (
                      <div key={mode} className="rounded-xl border border-border p-4">
                        <FieldLabel htmlFor={`price-${mode}`} required>
                          {DELIVERY_MODE_LABELS[mode]}
                        </FieldLabel>
                        <p className="mb-3 text-xs text-muted-foreground">
                          KES · total for 1 participant
                        </p>
                        <Input
                          id={`price-${mode}`} type="number" min="0" step="0.01"
                          value={price?.amount ?? ""}
                          onChange={(e) => patchPricing(mode, { amount: e.target.value })}
                          className={cn("tabular-nums", errors.pricing && "field-error")}
                          placeholder="0.00"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <ErrorText>{errors.pricing}</ErrorText>
            </SectionCard>
            <SectionCard
              icon={LayoutList}
              step="Section 05"
              title="Syllabus modules"
              description="Use the arrows to reorder the learner journey."
              action={
                form.modules.length > 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addModule}
                  >
                    <Plus className="size-4" /> Add Module
                  </Button>
                ) : undefined
              }
            >
              <div className="space-y-4">
                {form.modules.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-6 text-center">
                    <p className="mb-3 text-sm text-muted-foreground">No syllabus modules yet.</p>
                    <Button type="button" variant="outline" onClick={addModule}>
                      <Plus className="size-4" /> Add first module
                    </Button>
                  </div>
                ) : form.modules.map((module, index) => (
                  <div key={module.id} className="rounded-xl border border-border p-4 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold">Module {index + 1}</p>
                      <div className="flex items-center gap-1">
                        <Button type="button" variant="ghost" size="icon"
                          aria-label="Move module up" disabled={index === 0}
                          onClick={() => reorderModules(index, index - 1)}>
                          <ArrowUp className="size-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon"
                          aria-label="Move module down" disabled={index === form.modules.length - 1}
                          onClick={() => reorderModules(index, index + 1)}>
                          <ArrowDown className="size-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon"
                          aria-label="Remove module" onClick={() => removeModule(module.id!)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <FieldLabel htmlFor={`module-title-${module.id}`} required>Module title</FieldLabel>
                      <Input id={`module-title-${module.id}`} value={module.title}
                        onChange={(e) => patchModule(module.id!, { title: e.target.value })}
                        placeholder="Introduction to the subject" />
                    </div>
                    <div>
                      <FieldLabel htmlFor={`module-topics-${module.id}`}>Topics (one per line)</FieldLabel>
                      <Textarea id={`module-topics-${module.id}`} rows={4}
                        value={module.topics.join("\n")}
                        onChange={(e) => patchModule(module.id!, { topics: e.target.value.split("\n") })}
                        placeholder={"Topic one\nTopic two\nTopic three"} />
                    </div>
                    <div className="max-w-xs">
                      <FieldLabel htmlFor={`module-minutes-${module.id}`}>Estimated duration (minutes)</FieldLabel>
                      <Input id={`module-minutes-${module.id}`} type="number" min="0"
                        value={module.estimatedDuration ?? ""}
                        onChange={(e) => patchModule(module.id!, {
                          estimatedDuration: e.target.value === "" ? null : Number(e.target.value),
                        })} />
                    </div>
                  </div>
                ))}
              </div>
              <ErrorText>{errors.modules}</ErrorText>
            </SectionCard>
          </div>
          {/* Right column: summary */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="panel overflow-hidden">
              <div className="border-b border-border bg-surface px-5 py-4">
                <h2 className="text-sm font-semibold text-foreground">
                  Course summary
                </h2>
                <p className="text-xs text-muted-foreground">
                  Live preview of the payload
                </p>
              </div>
              <div className="space-y-4 p-5">
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-medium text-muted-foreground">
                      Completion
                    </span>
                    <span className="font-semibold text-foreground">
                      {completion}%
                    </span>
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
                    courseCategories?.find((c) => c.id === form.categoryId)?.name ??
                    "Not selected"
                  }
                />
                <SummaryRow
                  label="Level"
                  value={DIFFICULTY_LABELS[form.level]}
                />
                <SummaryRow
                  label="Duration"
                  value={
                    form.durationDays ? `${form.durationDays} day(s)` : "—"
                  }
                />
                <SummaryRow
                  label="Audiences"
                  value={
                    form.audiences.length
                      ? form.audiences
                          .map((id) => courseAudiences?.find((a) => a.id === id)?.name)
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
                  {DELIVERY_MODES.map((mode) => {
                    const price = form.pricing.find((p) => p.deliveryMode === mode);
                    return (
                      <div key={mode} className="flex items-center justify-between gap-3 py-1 text-xs">
                        <span className="text-muted-foreground">{DELIVERY_MODE_LABELS[mode]}</span>
                        <span className="font-semibold tabular-nums text-foreground">
                          {price?.amount?.trim()
                            ? `KES ${Number(price.amount).toLocaleString("en-KE")}`
                            : "Not set"}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.featured ? <Chip icon={Star}>Featured</Chip> : null}
                  {form.isPopular ? <Chip icon={Flame}>Popular</Chip> : null}
                  {form.certificateProvided ? (
                    <Chip icon={BadgeCheck}>Certificate</Chip>
                  ) : null}
                </div>
              </div>
            </div>
            {form.modules.length === 0 ? (
              <div className="mt-4">
                <EmptyState
                  icon={Sparkles}
                  title="Nothing configured yet"
                  description="Add the three delivery prices and syllabus modules to complete the course record."
                />
              </div>
            ) : null}
          </aside>
        </div>
      </div>
      {/* Sticky action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <p className="text-xs text-muted-foreground">
            {completion}% complete ·{" "}
            <span className="font-medium text-foreground">{form.status}</span>
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={handleSaveDraft}
            >
              <Save className="size-4" /> Save Draft
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handlePublishOrUpdate}
            >
              <Send className="size-4" />
              {submitButtonText || (isEditing ? "Save Changes" : "Publish Course")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}