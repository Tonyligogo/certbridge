import { CalendarDays, Info } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Course } from "../lib/pricing";
import { FieldError } from "./FieldError";
import type { StepProps } from "../types";

export function ScheduleLocationStep({
  draft,
  errors,
  onChange,
  course,
}: StepProps & { course: Course }) {
  const needsLocation =
    draft.deliveryMode === "CLIENT_SITE" || draft.deliveryMode === "OUR_VENUE";
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-8">
      <section className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold">Preferred dates</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            These are your preferred dates. Our team will confirm the final training schedule with you.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="preferredStartDate">Preferred start date</Label>
            <Input
              id="preferredStartDate"
              type="date"
              className="mt-2"
              min={today}
              value={draft.preferredStartDate}
              onChange={(e) => onChange({ preferredStartDate: e.target.value })}
              aria-invalid={Boolean(errors["preferredStartDate"])}
            />
            <FieldError message={errors["preferredStartDate"]} />
          </div>
          <div>
            <Label htmlFor="preferredEndDate">Preferred end date</Label>
            <Input
              id="preferredEndDate"
              type="date"
              className="mt-2"
              min={draft.preferredStartDate || today}
              value={draft.preferredEndDate}
              onChange={(e) => onChange({ preferredEndDate: e.target.value })}
              aria-invalid={Boolean(errors["preferredEndDate"])}
            />
            <FieldError message={errors["preferredEndDate"]} />
          </div>
        </div>

        <p className="flex gap-2 rounded-lg bg-accent p-3 text-sm text-accent-foreground">
          <CalendarDays className="mt-0.5 size-4 shrink-0" />
          Nothing is scheduled yet — this course runs {course.durationDays} day{course.durationDays > 1 ? "s" : ""} once confirmed.
        </p>
      </section>

      {needsLocation ? (
        <section className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold">Training location</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Required for this delivery mode so we can plan logistics.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="locationCountry">Country *</Label>
              <Input
                id="locationCountry"
                className="mt-2"
                maxLength={80}
                autoComplete="country-name"
                value={draft.locationCountry}
                onChange={(e) => onChange({ locationCountry: e.target.value })}
                aria-invalid={Boolean(errors["locationCountry"])}
              />
              <FieldError message={errors["locationCountry"]} />
            </div>
            <div>
              <Label htmlFor="locationCity">City *</Label>
              <Input
                id="locationCity"
                className="mt-2"
                maxLength={80}
                autoComplete="address-level2"
                value={draft.locationCity}
                onChange={(e) => onChange({ locationCity: e.target.value })}
                aria-invalid={Boolean(errors["locationCity"])}
              />
              <FieldError message={errors["locationCity"]} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="locationAddress">Address</Label>
              <Input
                id="locationAddress"
                className="mt-2"
                maxLength={240}
                autoComplete="street-address"
                value={draft.locationAddress}
                onChange={(e) => onChange({ locationAddress: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="locationNotes">Additional location information (optional)</Label>
              <Textarea
                id="locationNotes"
                className="mt-2"
                rows={3}
                maxLength={1000}
                placeholder="Access instructions, floor, parking, on-site contact…"
                value={draft.locationNotes}
                onChange={(e) => onChange({ locationNotes: e.target.value })}
              />
            </div>
          </div>
        </section>
      ) : (
        <p className="flex gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0" />
          No physical location needed for this delivery mode — we&apos;ll send joining details once confirmed.
        </p>
      )}

      <section>
        <Label htmlFor="specialRequirements" className="text-base font-semibold">
          Additional requirements or notes (optional)
        </Label>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Scheduling preferences, accessibility requirements, equipment needs, or anything else we should know.
        </p>
        <Textarea
          id="specialRequirements"
          className="mt-3"
          rows={5}
          maxLength={2000}
          value={draft.specialRequirements}
          onChange={(e) => onChange({ specialRequirements: e.target.value })}
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          {(draft.specialRequirements || "").length}/2000
        </p>
      </section>
    </div>
  );
}