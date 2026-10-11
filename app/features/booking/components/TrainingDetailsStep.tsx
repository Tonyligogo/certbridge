import { MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DELIVERY_MODE_DESCRIPTIONS,
  deliveryModeLabel,
  type DeliveryMode,
} from "../lib/pricing";
import { FieldError } from "./FieldError";
import type { StepProps } from "../types";
import type { Course } from "@/app/features/course-catalog/types/catalogue";


const ALL_DELIVERY_MODES: DeliveryMode[] = ["ONLINE", "CLIENT_SITE", "ARRANGED_VENUE"];

export function TrainingDetailsStep({
  draft,
  errors,
  onChange,
  course,
}: StepProps & { course: Course }) {
  console.log(draft)
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">How should we deliver it?</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Choose how you would like <span className="font-semibold text-primary">{course.title}</span> to be delivered.
        </p>
      </div>

      <div className="grid gap-3">
        {ALL_DELIVERY_MODES.map((mode) => {
          const selected = draft.deliveryMode === mode;
          const requiresLocation = mode === "CLIENT_SITE" || mode === "ARRANGED_VENUE";

          return (
            <button
              key={mode}
              type="button"
              onClick={() => onChange({ deliveryMode: mode })}
              aria-pressed={selected}
              className={cn(
                "flex gap-3 cursor-pointer rounded-xl border p-4 text-left transition-colors",
                selected
                  ? "border-primary bg-primary/10"
                  : "hover:border-primary",
              )}
            >
              <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
              <span className="flex-1">
                <span className="block font-medium">{deliveryModeLabel(mode)}</span>
                <span className="block text-sm text-muted-foreground">
                  {DELIVERY_MODE_DESCRIPTIONS[mode]}
                </span>
                {requiresLocation && (
                  <span className="mt-1 block text-xs text-muted-foreground">
                    Location details required in the next step.
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <FieldError message={errors["deliveryMode"]} />
    </div>
  );
}