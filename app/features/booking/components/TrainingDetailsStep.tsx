import { MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DELIVERY_MODE_DESCRIPTIONS,
  deliveryModeLabel,
  type Course,
  type DeliveryMode,
} from "../lib/pricing";
import { FieldError } from "./FieldError";
import type { StepProps } from "../types";

const ALL_DELIVERY_MODES: DeliveryMode[] = ["ONLINE", "CLIENT_SITE", "OUR_VENUE"];

export function TrainingDetailsStep({
  draft,
  errors,
  onChange,
  course,
}: StepProps & { course: Course }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">How should we deliver it?</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Choose how you would like {course.title} to be delivered.
        </p>
      </div>

      <div className="grid gap-3">
        {ALL_DELIVERY_MODES.map((mode) => {
          const selected = draft.deliveryMode === mode;
          const requiresLocation = mode === "CLIENT_SITE" || mode === "OUR_VENUE";

          return (
            <button
              key={mode}
              type="button"
              onClick={() => onChange({ deliveryMode: mode })}
              aria-pressed={selected}
              className={cn(
                "flex gap-3 rounded-xl border p-4 text-left transition-colors",
                selected
                  ? "border-primary bg-accent/60 ring-1 ring-primary"
                  : "border-border bg-card hover:border-primary/50",
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