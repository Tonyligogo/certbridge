import { Plus, Trash2, User, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FieldError } from "./FieldError";
import { newParticipant, type StepProps } from "../types";

export function ParticipantsStep({ draft, errors, onChange }: StepProps) {
  function setType(type: "individual" | "group") {
    if (type === "individual") {
      onChange({
        participantType: "individual",
        participants: draft.participants.slice(0, 1),
      });
    } else {
      onChange({
        participantType: "group",
        participants:
          draft.participants.length > 1
            ? draft.participants
            : [...draft.participants, newParticipant()],
      });
    }
  }

  function updateParticipant(
    key: string,
    patch: Partial<{ firstName: string; lastName: string; email: string; phone: string }>
  ) {
    onChange({
      participants: draft.participants.map((p) => (p.key === key ? { ...p, ...patch } : p)),
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Who is this training for?</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Participants don&apos;t need accounts — first and last names are required. Email and phone are optional.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { key: "individual" as const, icon: User, title: "One person", body: "Just me or a single colleague." },
          { key: "group" as const, icon: Users, title: "Multiple participants", body: "A team or whole organisation." },
        ].map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setType(option.key)}
            aria-pressed={draft.participantType === option.key}
            className={cn(
              "flex gap-3 rounded-xl border p-4 text-left transition-colors",
              draft.participantType === option.key
                ? "border-primary bg-accent/60 ring-1 ring-primary"
                : "border-border bg-card hover:border-primary/50"
            )}
          >
            <option.icon className="mt-0.5 size-5 shrink-0 text-primary" />
            <span>
              <span className="block font-medium">{option.title}</span>
              <span className="block text-sm text-muted-foreground">{option.body}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {draft.participants.map((participant, index) => (
          <div key={participant.key} className="rounded-xl border border-border bg-card p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Participant {index + 1}
              </p>
              {draft.participants.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    onChange({ participants: draft.participants.filter((p) => p.key !== participant.key) })
                  }
                >
                  <Trash2 className="size-4 mr-1" />
                  Remove
                </Button>
              )}
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <Label htmlFor={`p-first-name-${participant.key}`}>First name *</Label>
                <Input
                  id={`p-first-name-${participant.key}`}
                  className="mt-2"
                  value={participant.firstName}
                  maxLength={60}
                  onChange={(e) => updateParticipant(participant.key, { firstName: e.target.value })}
                  aria-invalid={Boolean(errors[`participants.${index}.firstName`])}
                />
                <FieldError message={errors[`participants.${index}.firstName`]} />
              </div>
              <div>
                <Label htmlFor={`p-last-name-${participant.key}`}>Last name *</Label>
                <Input
                  id={`p-last-name-${participant.key}`}
                  className="mt-2"
                  value={participant.lastName}
                  maxLength={60}
                  onChange={(e) => updateParticipant(participant.key, { lastName: e.target.value })}
                  aria-invalid={Boolean(errors[`participants.${index}.lastName`])}
                />
                <FieldError message={errors[`participants.${index}.lastName`]} />
              </div>
              <div>
                <Label htmlFor={`p-email-${participant.key}`}>Email (optional)</Label>
                <Input
                  id={`p-email-${participant.key}`}
                  type="email"
                  className="mt-2"
                  value={participant.email}
                  maxLength={255}
                  onChange={(e) => updateParticipant(participant.key, { email: e.target.value })}
                  aria-invalid={Boolean(errors[`participants.${index}.email`])}
                />
                <FieldError message={errors[`participants.${index}.email`]} />
              </div>
              <div>
                <Label htmlFor={`p-phone-${participant.key}`}>Phone (optional)</Label>
                <Input
                  id={`p-phone-${participant.key}`}
                  type="tel"
                  className="mt-2"
                  value={participant.phone}
                  maxLength={40}
                  onChange={(e) => updateParticipant(participant.key, { phone: e.target.value })}
                  aria-invalid={Boolean(errors[`participants.${index}.phone`])}
                />
                <FieldError message={errors[`participants.${index}.phone`]} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <FieldError message={errors["participants"]} />

      {draft.participantType === "group" && (
        <Button
          type="button"
          variant="outline"
          onClick={() => onChange({ participants: [...draft.participants, newParticipant()] })}
        >
          <Plus className="size-4 mr-1" />
          Add participant
        </Button>
      )}
    </div>
  );
}