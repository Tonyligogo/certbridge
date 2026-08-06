'use client';

import { useState } from "react";
import { Plus, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { slugify } from "./schema";
import { CustomDialog } from "@/components/custom-dialog";
import { useCreateCourseAudience } from "@/hooks/course-audience/use-course-audience";

export type Audience = {
  id: string;
  name: string;
  slug: string;
};

interface CreateAudienceDialogProps {
  trigger?: React.ReactNode;
  existingAudiences?: Audience[];
  onCreated?: (audience: Audience) => void;
}

export function CreateAudienceDialog({
  trigger,
  existingAudiences = [],
  onCreated,
}: CreateAudienceDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate: createAudience, isPending: isSubmitting } = useCreateCourseAudience();

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  // Error State
  const [errors, setErrors] = useState<{
    name?: string;
    slug?: string;
  }>({});

  const resetForm = () => {
    setName("");
    setSlug("");
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

    if (!trimmedName) {
      setErrors({ name: "Audience name is required." });
      return false;
    }

    if (!trimmedSlug) {
      setErrors({ slug: "URL Slug is required." });
      return false;
    }

    // Check duplicates against passed options
    const isDuplicateName = existingAudiences.some(
      (a) => a.name.toLowerCase() === trimmedName.toLowerCase()
    );
    const isDuplicateSlug = existingAudiences.some(
      (a) => a.slug.toLowerCase() === trimmedSlug.toLowerCase()
    );

    if (isDuplicateName || isDuplicateSlug) {
      setErrors({
        ...(isDuplicateName && { name: "An audience segment with this name already exists." }),
        ...(isDuplicateSlug && { slug: "An audience segment with this slug already exists." }),
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
    };

    createAudience(payload, {
      onSuccess: (data) => {
        if (data) {
          onCreated?.(data);
        }
        resetForm();
        setOpen(false);
      },
      onError: (error) => {
        console.error("Error creating audience:", error);
        setErrors({ name: "Failed to create audience. Please try again." });
      },
    });
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-2">
      <Plus className="size-4" />
      Create audience
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
      title="New target audience"
      description="Add a target learner role or job segment for your courses."
      className="sm:max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="space-y-1.5">
          <Label htmlFor="aud-name" className="text-sm font-medium">
            Audience name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="aud-name"
            autoFocus
            value={name}
            placeholder="e.g. HSE Officers & Managers"
            onChange={(e) => handleNameChange(e.target.value)}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        {/* Slug */}
        <div className="space-y-1.5">
          <Label htmlFor="aud-slug" className="text-sm font-medium">
            URL Slug <span className="text-destructive">*</span>
          </Label>
          <div className="flex gap-2">
            <Input
              id="aud-slug"
              value={slug}
              className="font-mono text-sm"
              placeholder="hse-officers-managers"
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

        {/* Action Buttons */}
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
            {isSubmitting ? "Creating..." : "Add audience"}
          </Button>
        </div>
      </form>
    </CustomDialog>
  );
}