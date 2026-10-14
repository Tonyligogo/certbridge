
"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ChevronUp,
  Pencil,
  Plus,
  Trash2,
  User,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FieldError } from "./FieldError";
import { newParticipant, type StepProps } from "../types";

export function ParticipantsStep({
  draft,
  errors,
  onChange,
}: StepProps) {
  const [expandedKey, setExpandedKey] = useState<string | null>(
    () => draft.participants.find(
      (p) => !p.firstName.trim() || !p.lastName.trim()
    )?.key ?? null
  );


  function setType(type: "individual" | "group") {
    if (type === "individual") {
      const first = draft.participants[0] ?? newParticipant();

      onChange({
        participantType: "individual",
        participants: [first],
      });

      setExpandedKey(
        first.firstName.trim() && first.lastName.trim()
          ? null
          : first.key
      );

      return;
    }

    if (draft.participants.length > 1) {
      onChange({ participantType: "group" });
      return;
    }

    const nextParticipant = newParticipant();

    onChange({
      participantType: "group",
      participants: [
        draft.participants[0] ?? newParticipant(),
        nextParticipant,
      ],
    });

    setExpandedKey(nextParticipant.key);
  }

  function updateParticipant(
    key: string,
    patch: Partial<{
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    }>
  ) {
    onChange({
      participants: draft.participants.map((participant) =>
        participant.key === key
          ? { ...participant, ...patch }
          : participant
      ),
    });
  }

  function addParticipant() {
    const participant = newParticipant();

    onChange({
      participantType: "group",
      participants: [...draft.participants, participant],
    });

    setExpandedKey(participant.key);
  }

  function removeParticipant(key: string) {
    const remaining = draft.participants.filter(
      (participant) => participant.key !== key
    );

    const nextParticipants =
      remaining.length > 0 ? remaining : [newParticipant()];

    onChange({
      participants: nextParticipants,
      participantType:
        nextParticipants.length === 1 ? "individual" : "group",
    });

    if (expandedKey === key) {
      setExpandedKey(null);
    }
  }

  function hasErrors(index: number) {
    return [
      "firstName",
      "lastName",
      "email",
      "phone",
    ].some((field) =>
      Boolean(errors[`participants.${index}.${field}`])
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">
          Who is this training for?
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Add the people attending this training. You can edit
          their details at any time.
        </p>
      </div>

      {/* Participant type */}
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          {
            key: "individual" as const,
            icon: User,
            title: "One person",
            body: "Just me or a single colleague.",
          },
          {
            key: "group" as const,
            icon: Users,
            title: "Multiple participants",
            body: "A team or whole organisation.",
          },
        ].map((option) => {
          const Icon = option.icon;

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => setType(option.key)}
              aria-pressed={
                draft.participantType === option.key
              }
              className={cn(
                "flex cursor-pointer gap-3 rounded-xl border p-4 text-left transition-colors",
                draft.participantType === option.key
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary"
              )}
            >
              <Icon className="mt-0.5 size-5 shrink-0 text-primary" />

              <span>
                <span className="block font-medium">
                  {option.title}
                </span>
                <span className="block text-sm text-muted-foreground">
                  {option.body}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Participants */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">
            Participants ({draft.participants.length})
          </h3>
        </div>

        {draft.participants.map((participant, index) => {
          const isComplete =
            Boolean(participant.firstName.trim()) &&
            Boolean(participant.lastName.trim());

          const participantHasErrors = hasErrors(index);

          const isExpanded =
            expandedKey === participant.key ||
            participantHasErrors;

          const displayName = [
            participant.firstName,
            participant.lastName,
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div
              key={participant.key}
              className={cn(
                "overflow-hidden rounded-xl border bg-card transition-colors",
                participantHasErrors
                  ? "border-destructive"
                  : isExpanded
                    ? "border-primary/40"
                    : "border-border"
              )}
            >
              {/* Compact participant header */}
              <div className="flex items-center gap-3 p-4">
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full",
                    isComplete
                      ? "bg-green-50 text-green-700"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isComplete ? (
                    <CheckCircle2 className="size-5" />
                  ) : (
                    <User className="size-5" />
                  )}
                </div>

                <button
                  type="button"
                  className="min-w-0 flex-1 cursor-pointer text-left"
                  onClick={() =>
                    setExpandedKey(
                      isExpanded ? null : participant.key
                    )
                  }
                  aria-expanded={isExpanded}
                >
                  <span className="block text-sm font-semibold">
                    {displayName || `Participant ${index + 1}`}
                  </span>

                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {participantHasErrors
                      ? "Please review participant details"
                      : participant.email ||
                        (isComplete
                          ? `Participant ${index + 1} · Details added`
                          : "Add participant details")}
                  </span>
                </button>

                <div className="flex shrink-0 items-center gap-1">
                  {draft.participants.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove participant ${index + 1}`}
                      onClick={() =>
                        removeParticipant(participant.key)
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={
                      isExpanded
                        ? "Collapse participant"
                        : "Edit participant"
                    }
                    aria-expanded={isExpanded}
                    onClick={() =>
                      setExpandedKey(
                        isExpanded ? null : participant.key
                      )
                    }
                  >
                    {isExpanded ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <Pencil className="size-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Expanded participant form */}
              {isExpanded && (
                <div className="border-t border-border px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label
                        htmlFor={`p-first-name-${participant.key}`}
                      >
                        First name *
                      </Label>
                      <Input
                        id={`p-first-name-${participant.key}`}
                        className="mt-2"
                        value={participant.firstName}
                        maxLength={60}
                        onChange={(e) =>
                          updateParticipant(participant.key, {
                            firstName: e.target.value,
                          })
                        }
                        aria-invalid={Boolean(
                          errors[`participants.${index}.firstName`]
                        )}
                      />
                      <FieldError
                        message={
                          errors[`participants.${index}.firstName`]
                        }
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor={`p-last-name-${participant.key}`}
                      >
                        Last name *
                      </Label>
                      <Input
                        id={`p-last-name-${participant.key}`}
                        className="mt-2"
                        value={participant.lastName}
                        maxLength={60}
                        onChange={(e) =>
                          updateParticipant(participant.key, {
                            lastName: e.target.value,
                          })
                        }
                        aria-invalid={Boolean(
                          errors[`participants.${index}.lastName`]
                        )}
                      />
                      <FieldError
                        message={
                          errors[`participants.${index}.lastName`]
                        }
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor={`p-email-${participant.key}`}
                      >
                        Email *
                      </Label>
                      <Input
                        id={`p-email-${participant.key}`}
                        type="email"
                        className="mt-2"
                        value={participant.email}
                        maxLength={255}
                        onChange={(e) =>
                          updateParticipant(participant.key, {
                            email: e.target.value,
                          })
                        }
                        aria-invalid={Boolean(
                          errors[`participants.${index}.email`]
                        )}
                      />
                      <FieldError
                        message={
                          errors[`participants.${index}.email`]
                        }
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor={`p-phone-${participant.key}`}
                      >
                        Phone *
                      </Label>
                      <Input
                        id={`p-phone-${participant.key}`}
                        type="tel"
                        className="mt-2"
                        value={participant.phone}
                        maxLength={40}
                        onChange={(e) =>
                          updateParticipant(participant.key, {
                            phone: e.target.value,
                          })
                        }
                        aria-invalid={Boolean(
                          errors[`participants.${index}.phone`]
                        )}
                      />
                      <FieldError
                        message={
                          errors[`participants.${index}.phone`]
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!isComplete || participantHasErrors}
                      onClick={() => setExpandedKey(null)}
                    >
                      <CheckCircle2 className="mr-2 size-4" />
                      Done
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <FieldError message={errors["participants"]} />

      {draft.participantType === "group" && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={addParticipant}
        >
          <Plus className="mr-2 size-4" />
          Add another participant
        </Button>
      )}

      <p className="text-xs text-muted-foreground">
        You can reopen any participant to update their details
        before submitting your booking.
      </p>
    </div>
  );
}
