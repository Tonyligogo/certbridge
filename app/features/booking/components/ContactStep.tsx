import { Info } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { StepProps } from "../types";
import { FieldError } from "./FieldError";

export function ContactStep({
  draft,
  errors,
  onChange,
  isSignedIn,
}: StepProps & { isSignedIn: boolean }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Your contact details</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {isSignedIn
            ? "We pre-filled your profile details — edit anything you'd like to use for this booking."
            : "You can request this training as a guest. No account needed."}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="contact_name">Full name *</Label>
          <Input
            id="contact_name"
            className="mt-2"
            value={draft.contactName}
            autoComplete="name"
            maxLength={120}
            onChange={(e) => onChange({ contactName: e.target.value })}
            aria-invalid={Boolean(errors["contactName"])}
          />
          <FieldError message={errors["contactName"]} />
        </div>

        <div>
          <Label htmlFor="contact_email">Email *</Label>
          <Input
            id="contact_email"
            type="email"
            className="mt-2"
            value={draft.contactEmail}
            autoComplete="email"
            maxLength={255}
            onChange={(e) => onChange({ contactEmail: e.target.value })}
            aria-invalid={Boolean(errors["contactEmail"])}
          />
          <FieldError message={errors["contactEmail"]} />
        </div>

        <div>
          <Label htmlFor="contact_phone">Phone number *</Label>
          <Input
            id="contact_phone"
            type="tel"
            className="mt-2"
            value={draft.contactPhone}
            autoComplete="tel"
            maxLength={40}
            onChange={(e) => onChange({ contactPhone: e.target.value })}
            aria-invalid={Boolean(errors["contactPhone"])}
          />
          <FieldError message={errors["contactPhone"]} />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="organization">Organisation / company (optional)</Label>
          <Input
            id="organization"
            className="mt-2"
            value={draft.organizationName}
            autoComplete="organization"
            maxLength={160}
            onChange={(e) => onChange({ organizationName: e.target.value })}
          />
          <FieldError message={errors["organizationName"]} />
        </div>
      </div>

      <p className="flex gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" />
        We use these details to confirm the schedule and pricing for your request.
      </p>
    </div>
  );
}
