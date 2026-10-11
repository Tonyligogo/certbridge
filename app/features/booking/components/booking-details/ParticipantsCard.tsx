"use client";

import {
  Award,
  Check,
  ChevronRight,
  ClipboardCheck,
  MessageSquareText,
  UserPlus,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type{ AdminBookingDetailsResponse } from "../../types/admin-booking";
import type{ BookingWorkflow } from "../../types";

interface ParticipantsCardProps {
  booking: AdminBookingDetailsResponse;
  workflow: BookingWorkflow;

  onManageParticipants?: () => void;
  onRecordAttendance?: () => void;
  onIssueCertificates?: () => void;
  onCollectFeedback?: () => void;
  onViewParticipant?: (
    participantId: string
  ) => void;
}

export function ParticipantsCard({
  booking,
  workflow,
  onManageParticipants,
  onRecordAttendance,
  onIssueCertificates,
  onCollectFeedback,
  onViewParticipant,
}: ParticipantsCardProps) {
  const participants =
    booking.participants;

  const registered =
    participants.length;

  const expected =
    booking.participantCount;

  const showOutcomes =
    workflow.delivery.ended ||
    workflow.stage === "COMPLETED";

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base">
              Participants
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              {registered} of {expected}{" "}
              {expected === 1
                ? "participant"
                : "participants"}{" "}
              added
            </p>
          </div>

          {!showOutcomes && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={
                onManageParticipants
              }
            >
              <UserPlus className="mr-2 size-4" />
              Manage
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <RosterProgress
          registered={registered}
          expected={expected}
        />

        {showOutcomes && (
          <>
            <ParticipantOutcomes
              booking={booking}
              onRecordAttendance={
                onRecordAttendance
              }
              onIssueCertificates={
                onIssueCertificates
              }
              onCollectFeedback={
                onCollectFeedback
              }
            />

            <div className="border-t" />
          </>
        )}

        <ParticipantList
          participants={participants}
          showOutcomes={showOutcomes}
          onViewParticipant={
            onViewParticipant
          }
        />

        {participants.length === 0 && (
          <EmptyParticipants
            expected={expected}
            onManageParticipants={
              onManageParticipants
            }
          />
        )}
      </CardContent>
    </Card>
  );
}

function RosterProgress({
  registered,
  expected,
}: {
  registered: number;
  expected: number;
}) {
  const percentage =
    expected > 0
      ? Math.min(
          (registered / expected) * 100,
          100
        )
      : 0;

  const complete =
    expected > 0 &&
    registered >= expected;

  return (
    <div className="rounded-lg bg-muted/40 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-muted-foreground" />

          <span className="text-sm font-medium">
            Participant roster
          </span>
        </div>

        <span
          className={
            complete
              ? "text-xs font-medium text-emerald-700"
              : "text-xs font-medium text-muted-foreground"
          }
        >
          {registered} / {expected}
        </span>
      </div>

      <Progress
        value={percentage}
        className="mt-3 h-1.5"
      />

      {!complete && (
        <p className="mt-2 text-xs text-muted-foreground">
          {expected - registered}{" "}
          {expected - registered === 1
            ? "participant still needs"
            : "participants still need"}{" "}
          to be added.
        </p>
      )}

      {complete && (
        <p className="mt-2 flex items-center gap-1 text-xs text-emerald-700">
          <Check className="size-3" />
          Participant roster complete
        </p>
      )}
    </div>
  );
}

function ParticipantOutcomes({
  booking,
  onRecordAttendance,
  onIssueCertificates,
  onCollectFeedback,
}: {
  booking: AdminBookingDetailsResponse;

  onRecordAttendance?: () => void;
  onIssueCertificates?: () => void;
  onCollectFeedback?: () => void;
}) {
  const participants =
    booking.participants;

  const attendanceRecorded =
    participants.filter(
      (participant) =>
        participant.attended !== null
    ).length;

  const attended =
    participants.filter(
      (participant) =>
        participant.attended === true
    ).length;

  const certificates =
    participants.filter(
      (participant) =>
        participant.attended === true &&
        participant.certificateIssued
    ).length;

  const feedback =
    participants.filter(
      (participant) =>
        participant.attended === true &&
        participant.feedbackSubmitted
    ).length;

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <OutcomeMetric
        icon={ClipboardCheck}
        label="Attendance"
        value={`${attendanceRecorded}/${participants.length}`}
        helper={
          attendanceRecorded ===
          participants.length
            ? `${attended} attended`
            : "Not fully recorded"
        }
        action={
          attendanceRecorded <
          participants.length
            ? {
                label: "Record",
                onClick:
                  onRecordAttendance,
              }
            : undefined
        }
      />

      <OutcomeMetric
        icon={Award}
        label="Certificates"
        value={`${certificates}/${attended}`}
        helper="Issued to attendees"
        action={
          attended > certificates
            ? {
                label: "Issue",
                onClick:
                  onIssueCertificates,
              }
            : undefined
        }
      />

      <OutcomeMetric
        icon={MessageSquareText}
        label="Feedback"
        value={`${feedback}/${attended}`}
        helper="Received from attendees"
        action={
          attended > feedback
            ? {
                label: "Collect",
                onClick:
                  onCollectFeedback,
              }
            : undefined
        }
      />
    </div>
  );
}

interface OutcomeMetricProps {
  icon: React.ElementType;
  label: string;
  value: string;
  helper: string;

  action?: {
    label: string;
    onClick?: () => void;
  };
}

function OutcomeMetric({
  icon: Icon,
  label,
  value,
  helper,
  action,
}: OutcomeMetricProps) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />

        <span className="text-xs">
          {label}
        </span>
      </div>

      <p className="mt-2 text-lg font-semibold">
        {value}
      </p>

      <p className="mt-0.5 text-xs text-muted-foreground">
        {helper}
      </p>

      {action && (
        <Button
          type="button"
          variant="link"
          size="sm"
          className="mt-1 h-auto px-0 py-0 text-xs"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

type Participant =
  AdminBookingDetailsResponse["participants"][number];

function ParticipantList({
  participants,
  showOutcomes,
  onViewParticipant,
}: {
  participants: Participant[];
  showOutcomes: boolean;

  onViewParticipant?: (
    participantId: string
  ) => void;
}) {
  if (participants.length === 0) {
    return null;
  }

  const visible =
    participants.slice(0, 5);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">
          Roster
        </p>

        {participants.length > 5 && (
          <span className="text-xs text-muted-foreground">
            Showing 5 of{" "}
            {participants.length}
          </span>
        )}
      </div>

      <div className="divide-y">
        {visible.map(
          (participant) => (
            <ParticipantRow
              key={participant.id}
              participant={
                participant
              }
              showOutcomes={
                showOutcomes
              }
              onClick={() =>
                onViewParticipant?.(
                  participant.id
                )
              }
            />
          )
        )}
      </div>
    </div>
  );
}

function ParticipantRow({
  participant,
  showOutcomes,
  onClick,
}: {
  participant: Participant;
  showOutcomes: boolean;
  onClick?: () => void;
}) {
  const name =
    `${participant.firstName} ${participant.lastName}`;

  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 py-3 text-left"
      onClick={onClick}
    >
      <ParticipantAvatar
        firstName={
          participant.firstName
        }
        lastName={
          participant.lastName
        }
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {name}
        </p>

        <p className="truncate text-xs text-muted-foreground">
          {participant.email}
        </p>
      </div>

      {showOutcomes && (
        <ParticipantOutcomeBadges
          participant={participant}
        />
      )}

      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
    </button>
  );
}

function ParticipantAvatar({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`
      .toUpperCase();

  return (
    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
      {initials}
    </div>
  );
}

function ParticipantOutcomeBadges({
  participant,
}: {
  participant: Participant;
}) {
  if (participant.attended === null) {
    return (
      <span className="hidden text-xs text-amber-700 sm:inline">
        Attendance pending
      </span>
    );
  }

  if (
    participant.attended === false
  ) {
    return (
      <span className="hidden text-xs text-muted-foreground sm:inline">
        Absent
      </span>
    );
  }

  return (
    <div className="hidden items-center gap-2 sm:flex">
      <span className="text-xs font-medium text-emerald-700">
        Attended
      </span>

      {participant.certificateIssued && (
        <Award className="size-3.5 text-muted-foreground" />
      )}

      {participant.feedbackSubmitted && (
        <MessageSquareText className="size-3.5 text-muted-foreground" />
      )}
    </div>
  );
}

function EmptyParticipants({
  expected,
  onManageParticipants,
}: {
  expected: number;
  onManageParticipants?: () => void;
}) {
  return (
    <div className="rounded-lg border border-dashed px-4 py-8 text-center">
      <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-muted">
        <Users className="size-5 text-muted-foreground" />
      </div>

      <p className="mt-3 text-sm font-medium">
        No participants added
      </p>

      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
        This booking is for{" "}
        {expected}{" "}
        {expected === 1
          ? "participant"
          : "participants"},
        but participant details have
        not been added yet.
      </p>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-4"
        onClick={
          onManageParticipants
        }
      >
        <UserPlus className="mr-2 size-4" />
        Add participants
      </Button>
    </div>
  );
}