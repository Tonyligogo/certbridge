"use client";

import {
  Building2,
  Check,
  ChevronRight,
  CircleAlert,
  LucideIcon,
  MapPin,
  Monitor,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import type {
  ResourceSourcingStatus,
} from "@/generated/prisma/enums";


import type { BookingWorkflow } from "../../types";
import type { AdminBookingDetailsResponse } from "../../types/admin-booking";


interface ResourcesCardProps {
  booking: AdminBookingDetailsResponse;
  workflow: BookingWorkflow;

  onSourceTrainer?: () => void;
  onSourceVenue?: () => void;

  onViewTrainer?: (
    assignmentId: string
  ) => void;

  onViewVenue?: (
    assignmentId: string
  ) => void;
}

export function ResourcesCard({
  booking,
  workflow,

  onSourceTrainer,
  onSourceVenue,

  onViewTrainer,
  onViewVenue,
}: ResourcesCardProps) {
  const trainerState =
    workflow.resources.trainer;

  const venueState =
    workflow.resources.venue;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            Resources
          </CardTitle>

          {workflow.resources.ready && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
              <Check className="size-3.5" />
              Ready
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <TrainerResource
          booking={booking}
          ready={trainerState.ready}
          onSource={onSourceTrainer}
          onView={onViewTrainer}
        />

        <div className="border-t" />

        <VenueResource
          booking={booking}
          required={venueState.required}
          ready={venueState.ready}
          onSource={onSourceVenue}
          onView={onViewVenue}
        />
      </CardContent>
    </Card>
  );
}

interface TrainerResourceProps {
  booking: AdminBookingDetailsResponse;
  ready: boolean;

  onSource?: () => void;

  onView?: (
    assignmentId: string
  ) => void;
}

function TrainerResource({
  booking,
  ready,
  onSource,
  onView,
}: TrainerResourceProps) {
  const confirmed =
    booking.trainers.find(
      ({ status }) =>
        status === "CONFIRMED"
    );

  const candidates =
    booking.trainers.filter(
      ({ status }) =>
        status !== "CONFIRMED" &&
        status !== "CANCELLED" &&
        status !== "REPLACED"
    );

  return (
    <ResourceSection
      icon={UserRound}
      title="Trainer"
      ready={ready}
      required
    >
      {confirmed ? (
        <TrainerAssignment
          assignment={confirmed}
          confirmed
          onClick={() =>
            onView?.(confirmed.id)
          }
        />
      ) : candidates.length > 0 ? (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            {candidates.length === 1
              ? "1 trainer candidate"
              : `${candidates.length} trainer candidates`}
          </p>

          <div className="space-y-1">
            {candidates
              .slice(0, 3)
              .map((assignment) => (
                <TrainerAssignment
                  key={assignment.id}
                  assignment={
                    assignment
                  }
                  onClick={() =>
                    onView?.(
                      assignment.id
                    )
                  }
                />
              ))}
          </div>

          {candidates.length > 3 && (
            <p className="px-1 text-xs text-muted-foreground">
              +{candidates.length - 3} more
            </p>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onSource}
          >
            Continue trainer sourcing
          </Button>
        </div>
      ) : (
        <MissingResource
          message="No trainer has been sourced yet."
          actionLabel="Find a trainer"
          onAction={onSource}
        />
      )}
    </ResourceSection>
  );
}

type TrainerAssignment =
  AdminBookingDetailsResponse["trainers"][number];

function TrainerAssignment({
  assignment,
  confirmed = false,
  onClick,
}: {
  assignment: TrainerAssignment;
  confirmed?: boolean;
  onClick?: () => void;
}) {
  const trainer =
    assignment.trainer;

  const name =
    `${trainer.firstName} ${trainer.lastName}`;

  const location = [
    trainer.primaryCity,
    trainer.primaryCountry,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-muted/60"
      onClick={onClick}
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
        <UserRound className="size-4 text-muted-foreground" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium">
            {name}
          </p>

          {confirmed && (
            <Check className="size-3.5 shrink-0 text-emerald-600" />
          )}
        </div>

        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
          {location && (
            <span className="truncate text-xs text-muted-foreground">
              {location}
            </span>
          )}

          {!confirmed && (
            <ResourceStatusBadge
              status={
                assignment.status
              }
            />
          )}
        </div>
      </div>

      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
    </button>
  );
}

interface VenueResourceProps {
  booking: AdminBookingDetailsResponse;

  required: boolean;
  ready: boolean;

  onSource?: () => void;

  onView?: (
    assignmentId: string
  ) => void;
}

function VenueResource({
  booking,
  required,
  ready,
  onSource,
  onView,
}: VenueResourceProps) {
  if (!required) {
    return (
      <NonRequiredVenue
        booking={booking}
      />
    );
  }

  const confirmed =
    booking.venues.find(
      ({ status }) =>
        status === "CONFIRMED"
    );

  const candidates =
    booking.venues.filter(
      ({ status }) =>
        status !== "CONFIRMED" &&
        status !== "CANCELLED" &&
        status !== "REPLACED"
    );

  return (
    <ResourceSection
      icon={Building2}
      title="Venue"
      ready={ready}
      required
    >
      {confirmed ? (
        <VenueAssignment
          assignment={confirmed}
          confirmed
          onClick={() =>
            onView?.(confirmed.id)
          }
        />
      ) : candidates.length > 0 ? (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            {candidates.length === 1
              ? "1 venue candidate"
              : `${candidates.length} venue candidates`}
          </p>

          <div className="space-y-1">
            {candidates
              .slice(0, 3)
              .map((assignment) => (
                <VenueAssignment
                  key={assignment.id}
                  assignment={
                    assignment
                  }
                  onClick={() =>
                    onView?.(
                      assignment.id
                    )
                  }
                />
              ))}
          </div>

          {candidates.length > 3 && (
            <p className="px-1 text-xs text-muted-foreground">
              +{candidates.length - 3} more
            </p>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onSource}
          >
            Continue venue sourcing
          </Button>
        </div>
      ) : (
        <MissingResource
          message="No venue has been sourced yet."
          actionLabel="Find a venue"
          onAction={onSource}
        />
      )}
    </ResourceSection>
  );
}

type VenueAssignment =
  AdminBookingDetailsResponse["venues"][number];

function VenueAssignment({
  assignment,
  confirmed = false,
  onClick,
}: {
  assignment: VenueAssignment;
  confirmed?: boolean;
  onClick?: () => void;
}) {
  const venue =
    assignment.venue;

  const location = [
    venue.city,
    venue.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-muted/60"
      onClick={onClick}
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
        <Building2 className="size-4 text-muted-foreground" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium">
            {venue.name}
          </p>

          {confirmed && (
            <Check className="size-3.5 shrink-0 text-emerald-600" />
          )}
        </div>

        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
          {location && (
            <span className="truncate text-xs text-muted-foreground">
              {location}
            </span>
          )}

          {!confirmed && (
            <ResourceStatusBadge
              status={
                assignment.status
              }
            />
          )}
        </div>
      </div>

      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
    </button>
  );
}

function NonRequiredVenue({
  booking,
}: {
  booking: AdminBookingDetailsResponse;
}) {
  if (
    booking.deliveryMode === "ONLINE"
  ) {
    return (
      <ResourceSection
        icon={Monitor}
        title="Venue"
        ready
        required={false}
      >
        <div className="flex items-start gap-3 rounded-md bg-muted/40 p-3">
          <Monitor className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

          <div>
            <p className="text-sm font-medium">
              Online delivery
            </p>

            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
              No physical venue is
              required for this booking.
            </p>
          </div>
        </div>
      </ResourceSection>
    );
  }

  return (
    <ResourceSection
      icon={MapPin}
      title="Venue"
      ready
      required={false}
    >
      <div className="rounded-md bg-muted/40 p-3">
        <div className="flex gap-3">
          <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

          <div className="min-w-0">
            <p className="text-sm font-medium">
              Client site
            </p>

            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
              Venue sourcing is not
              required. Training will be
              delivered at the client&apos;s
              location.
            </p>

            <ClientSiteLocation
              booking={booking}
            />
          </div>
        </div>
      </div>
    </ResourceSection>
  );
}

function ClientSiteLocation({
  booking,
}: {
  booking: AdminBookingDetailsResponse;
}) {
  const location = [
    booking.locationAddress,
    booking.locationCity,
    booking.locationCountry,
  ]
    .filter(Boolean)
    .join(", ");

  if (!location) {
    return (
      <p className="mt-2 text-xs font-medium text-amber-700">
        Client location not specified
      </p>
    );
  }

  return (
    <p className="mt-2 text-xs text-foreground">
      {location}
    </p>
  );
}

function MissingResource({
  message,
  actionLabel,
  onAction,
}: {
  message: string;
  actionLabel: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-md border border-dashed p-3">
      <p className="text-sm text-muted-foreground">
        {message}
      </p>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-3 w-full"
        onClick={onAction}
      >
        {actionLabel}
      </Button>
    </div>
  );
}

function ResourceSection({
  icon: Icon,
  title,
  ready,
  required,
  children,
}: {
  icon: LucideIcon;
  title: string;
  ready: boolean;
  required: boolean;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-muted-foreground" />

          <h3 className="text-sm font-medium">
            {title}
          </h3>
        </div>

        {required ? (
          ready ? (
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-700">
              <Check className="size-3" />
              Confirmed
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-medium text-amber-700">
              <CircleAlert className="size-3" />
              Required
            </span>
          )
        ) : (
          <span className="text-xs text-muted-foreground">
            Not required
          </span>
        )}
      </div>

      {children}
    </section>
  );
}

const resourceStatusConfig: Record<
  ResourceSourcingStatus,
  {
    label: string;
    className: string;
  }
> = {
  CONSIDERING: {
    label: "Considering",
    className:
      "border-slate-200 bg-slate-50 text-slate-600",
  },

  CONTACTED: {
    label: "Contacted",
    className:
      "border-blue-200 bg-blue-50 text-blue-700",
  },

  AVAILABLE: {
    label: "Available",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
  },

  UNAVAILABLE: {
    label: "Unavailable",
    className:
      "border-slate-200 bg-slate-100 text-slate-600",
  },

  CONFIRMED: {
    label: "Confirmed",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
  },

  REPLACED: {
    label: "Replaced",
    className:
      "border-slate-200 bg-slate-100 text-slate-500",
  },

  CANCELLED: {
    label: "Cancelled",
    className:
      "border-slate-200 bg-slate-100 text-slate-500",
  },
};

function ResourceStatusBadge({
  status,
}: {
  status: ResourceSourcingStatus;
}) {
  const config =
    resourceStatusConfig[status];

  return (
    <Badge
      variant="outline"
      className={`h-5 px-1.5 text-[10px] font-medium ${config.className}`}
    >
      {config.label}
    </Badge>
  );
}