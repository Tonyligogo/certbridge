import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { deliveryModeLabel, type DeliveryMode } from "../lib/pricing";
import type { BookingDraft } from "../types";
import type { Course } from "@/app/features/course-catalog/types/catalogue";


function formatDate(value?: string) {
  if (!value) return "Flexible";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

export function ReviewStep({
  draft,
  course,
  onEditStep,
}: {
  draft: BookingDraft;
  course: Course;
  onEditStep: (step: number) => void;
}) {
  const requiresLocation = draft.deliveryMode === "CLIENT_SITE" || draft.deliveryMode === "ARRANGED_VENUE";
  const location = [draft.locationAddress, draft.locationCity, draft.locationCountry]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Review your request</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Check everything below, then send your request. Our team replies with availability and a final quote —
          no payment is taken now.
        </p>
      </div>

      <Section title="Contact" step={0} onEditStep={onEditStep}>
        <Row label="Name" value={draft.contactName} />
        <Row label="Email" value={draft.contactEmail} />
        <Row label="Phone" value={draft.contactPhone || "—"} />
        {draft.organizationName && <Row label="Organisation" value={draft.organizationName} />}
      </Section>

      <Section
        title={`Participants (${draft.participants.length})`}
        step={1}
        onEditStep={onEditStep}
      >
        <ul className="space-y-2">
          {draft.participants.map((p, index) => {
            const fullName = [p.firstName, p.lastName].filter(Boolean).join(" ");
            return (
              <li key={p.key} className="text-sm">
                <span className="font-medium">{index + 1}. {fullName || "Unnamed Participant"}</span>
                {(p.email || p.phone) && (
                  <span className="text-muted-foreground">
                    {" — "}
                    {[p.email, p.phone].filter(Boolean).join(" · ")}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </Section>

      <Section title="Delivery" step={2} onEditStep={onEditStep}>
        <Row
          label="Course"
          value={`${course.title}${course.durationDays ? ` · ${course.durationDays} day${course.durationDays > 1 ? "s" : ""}` : ""}`}
        />
        <Row
          label="Mode"
          value={draft.deliveryMode ? deliveryModeLabel(draft.deliveryMode as DeliveryMode) : "—"}
        />
      </Section>

      <Section title="Schedule & location" step={3} onEditStep={onEditStep}>
        <Row label="Preferred start" value={formatDate(draft.preferredStartDate)} />
        <Row label="Preferred end" value={formatDate(draft.preferredEndDate)} />
        {requiresLocation && <Row label="Location" value={location || "—"} />}
        {draft.locationNotes && <Row label="Location notes" value={draft.locationNotes} />}
        {draft.specialRequirements && (
          <Row label="Additional requirements" value={draft.specialRequirements} />
        )}
      </Section>
    </div>
  );
}

function Section({
  title,
  step,
  onEditStep,
  children,
}: {
  title: string;
  step: number;
  onEditStep: (step: number) => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <Button type="button" variant="ghost" size="sm" onClick={() => onEditStep(step)}>
          <Pencil className="size-3.5" />
          Edit
        </Button>
      </div>
      <Separator className="my-3" />
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-0.5 text-sm sm:grid-cols-[10rem_1fr] sm:gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="wrap-break-word whitespace-pre-line font-medium text-base">{value}</span>
    </div>
  );
}