'use client';

import { useState } from "react";
import { Plus, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { slugify } from "./schema";
import { CustomDialog } from "@/components/custom-dialog";
import { useCreateCourseCategory } from "@/hooks/course-category/use-course-category";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isActive: boolean;
};

interface CreateCategoryDialogProps {
  trigger?: React.ReactNode;
  existingCategories?: { name: string; slug: string }[];
  onCreated?: (category: Category) => void;
}

export function CreateCategoryDialog({
  trigger,
  existingCategories = [],
  onCreated,
}: CreateCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const {mutate: createCategory, isPending:isSubmitting} = useCreateCourseCategory();

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Error State
  const [errors, setErrors] = useState<{
    name?: string;
    slug?: string;
    description?: string;
  }>({});

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setIsActive(true);
    setErrors({});
  };

  const handleNameChange = (val: string) => {
    setName(val);
    setErrors((prev) => ({ ...prev, name: undefined }));

    // Auto-generate slug if it hasn't been manually altered or matches previous slugify output
    if (!slug || slug === slugify(name)) {
      setSlug(slugify(val));
      setErrors((prev) => ({ ...prev, slug: undefined }));
    }
  };

  const validate = () => {
    const trimmedName = name.trim();
    const trimmedSlug = slug.trim();

    // 1. Check duplicates against passed options
    const isDuplicateName = existingCategories.some(
      (c) => c.name.toLowerCase() === trimmedName.toLowerCase()
    );
    const isDuplicateSlug = existingCategories.some(
      (c) => c.slug.toLowerCase() === trimmedSlug.toLowerCase()
    );

    if (isDuplicateName || isDuplicateSlug) {
      setErrors({
        ...(isDuplicateName && { name: "A category with this name already exists." }),
        ...(isDuplicateSlug && { slug: "A category with this slug already exists." }),
      });
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || undefined,
      isActive,
    };

     createCategory(payload, {
        onSuccess: (data) => {
          if(data){
            onCreated?.(data);
          }
          resetForm();
          setOpen(false);
        },
        onError: (error) => {
          console.error("Error creating category:", error);
          setErrors({ name: "Failed to create category. Please try again." });
        },
      });
    };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-2">
      <Plus className="size-4" />
      Create category
    </Button>
  );

  return (
    <CustomDialog
      isOpen={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) resetForm();
      }}
      trigger={trigger ?? defaultTrigger}
      title="New course category"
      description="Add a training sector to organize courses in your catalogue."
      className="sm:max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="space-y-1.5">
          <Label htmlFor="cat-name" className="text-sm font-medium">
            Category name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="cat-name"
            autoFocus
            value={name}
            placeholder="e.g. Sustainability & ESG"
            onChange={(e) => handleNameChange(e.target.value)}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        {/* Slug */}
        <div className="space-y-1.5">
          <Label htmlFor="cat-slug" className="text-sm font-medium">
            URL Slug <span className="text-destructive">*</span>
          </Label>
          <div className="flex gap-2">
            <Input
              id="cat-slug"
              value={slug}
              className="font-mono text-sm"
              placeholder="sustainability-esg"
              onChange={(e) => {
                setSlug(slugify(e.target.value));
                setErrors((prev) => ({ ...prev, slug: undefined }));
              }}
            />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={() => setSlug(slugify(name))}
              title="Generate slug from name"
            >
              <Wand2 className="size-4" />
            </Button>
          </div>
          {errors.slug && <p className="text-xs text-destructive">{errors.slug}</p>}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="cat-desc" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="cat-desc"
            rows={3}
            value={description}
            placeholder="Brief summary of what falls into this category..."
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && (
            <p className="text-xs text-destructive">{errors.description}</p>
          )}
        </div>

        {/* Active Toggle */}
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="space-y-0.5">
            <Label htmlFor="cat-active" className="cursor-pointer text-sm font-medium">
              Active category
            </Label>
            <p className="text-xs text-muted-foreground">
              Inactive categories will be hidden from public filters.
            </p>
          </div>
          <Switch
            id="cat-active"
            checked={isActive}
            onCheckedChange={setIsActive}
          />
        </div>
          {/* action buttons */}
        <div className="flex w-full items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            disabled={isSubmitting}
            onClick={() => {
              resetForm();
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Add category"}
          </Button>
        </div>
      </form>
    </CustomDialog>
  );
}