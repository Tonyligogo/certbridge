import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export const BOOKING_STEPS = [
  "Contact",
  "Participants",
  "Training details",
  "Schedule & location",
  "Review",
] as const;

export function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-4">
      {BOOKING_STEPS.map((label, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                done && "border-primary bg-primary text-primary-foreground",
                active && "border-primary bg-background text-primary",
                !done && !active && "border-border bg-muted text-muted-foreground",
              )}
              aria-current={active ? "step" : undefined}
            >
              {done ? <Check className="size-3.5" /> : index + 1}
            </span>
            <span
              className={cn(
                "text-sm whitespace-nowrap",
                active ? "font-medium text-foreground" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
            {index < BOOKING_STEPS.length - 1 && (
              <span className="hidden h-px w-6 bg-border sm:block" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
