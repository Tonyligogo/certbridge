import {
  CalendarCheck2,
  Check,
  FileText,
  GraduationCap,
  UserRoundCheck,
  X,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import type { AdminBookingDetailsResponse } from "../../types/admin-booking";
import type { BookingWorkflow, BookingWorkflowStage } from "../../types";

interface BookingProgressProps {
  booking: AdminBookingDetailsResponse;
  workflow: BookingWorkflow;
}

type ProgressStepId =
  | "BOOKING"
  | "RESOURCES"
  | "QUOTE"
  | "DELIVERY";

type ProgressStepState =
  | "COMPLETE"
  | "CURRENT"
  | "UPCOMING"
  | "BLOCKED";

type ProgressStep = {
  id: ProgressStepId;
  label: string;
  description: string;
  state: ProgressStepState;
  icon: LucideIcon;
};

const STEP_ORDER: ProgressStepId[] = [
  "BOOKING",
  "RESOURCES",
  "QUOTE",
  "DELIVERY",
];

function getCurrentStep(
  stage: BookingWorkflowStage
): ProgressStepId {
  switch (stage) {
    case "RESOURCE_SOURCING":
      return "RESOURCES";

    case "QUOTE_PREPARATION":
        case "AWAITING_QUOTE_RESPONSE":
            return "QUOTE";

    case "SCHEDULING":
    case "UPCOMING":
    case "DELIVERY":
    case "COMPLETED":
      return "DELIVERY";

    case "CANCELLED":
      return "BOOKING";

    default:
      return "BOOKING";
  }
}

function getResourceDescription(
  booking: AdminBookingDetailsResponse,
  workflow: BookingWorkflow
) {
  const trainerReady =
    workflow.resources.trainer.ready;

  const venueRequired =
    workflow.resources.venue.required;

  const venueReady =
    workflow.resources.venue.ready;

  if (trainerReady && venueReady) {
    return venueRequired
      ? "Trainer & venue confirmed"
      : "Trainer confirmed";
  }

  if (!trainerReady && venueRequired && !venueReady) {
    return "Trainer & venue required";
  }

  if (!trainerReady) {
    return "Trainer required";
  }

  if (venueRequired && !venueReady) {
    return "Venue required";
  }

  if (booking.deliveryMode === "CLIENT_SITE") {
    return "Trainer confirmed";
  }

  return "Resources ready";
}

function getQuoteDescription(
  workflow: BookingWorkflow
) {
  if (!workflow.quote.exists) {
    return "Not created";
  }

  switch (workflow.quote.status) {
    case "DRAFT":
      return "Draft";

    case "SENT":
      return "Awaiting response";

    case "ACCEPTED":
      return "Accepted";

    case "DECLINED":
      return "Declined";

    case "EXPIRED":
      return "Expired";

    case "CANCELLED":
      return "Cancelled";

    default:
      return "Quote";
  }
}

function getDeliveryDescription(
  workflow: BookingWorkflow
) {
  if (workflow.stage === "COMPLETED") {
    return "Completed";
  }

  if (workflow.delivery.inProgress) {
    return "In progress";
  }

  if (workflow.delivery.upcoming) {
    return "Upcoming";
  }

  if (workflow.delivery.ended) {
    return "Post-training";
  }

  if (workflow.scheduling.scheduled) {
    return "Scheduled";
  }

  return "Not scheduled";
}

function getSteps(
  booking: AdminBookingDetailsResponse,
  workflow: BookingWorkflow
): ProgressStep[] {
  if (workflow.stage === "CANCELLED") {
    return [
      {
        id: "BOOKING",
        label: "Booking",
        description: "Cancelled",
        state: "BLOCKED",
        icon: X,
      },
      {
        id: "RESOURCES",
        label: "Resources",
        description: getResourceDescription(
          booking,
          workflow
        ),
        state: "UPCOMING",
        icon: UserRoundCheck,
      },
      {
        id: "QUOTE",
        label: "Quote",
        description:
          getQuoteDescription(workflow),
        state: "UPCOMING",
        icon: FileText,
      },
      {
        id: "DELIVERY",
        label: "Delivery",
        description: "Cancelled",
        state: "UPCOMING",
        icon: GraduationCap,
      },
    ];
  }

  const currentStep =
    getCurrentStep(workflow.stage);

  const currentIndex =
    STEP_ORDER.indexOf(currentStep);

  return [
    {
      id: "BOOKING",
      label: "Booking",
      description:
        booking.status === "CONFIRMED" ||
        booking.status === "COMPLETED"
          ? "Confirmed"
          : "Received",
      state:
        currentIndex > 0
          ? "COMPLETE"
          : "CURRENT",
      icon: CalendarCheck2,
    },

    {
      id: "RESOURCES",
      label: "Resources",
      description: getResourceDescription(
        booking,
        workflow
      ),
      state:
        currentIndex > 1
          ? "COMPLETE"
          : currentIndex === 1
            ? "CURRENT"
            : "UPCOMING",
      icon: UserRoundCheck,
    },

    {
      id: "QUOTE",
      label: "Quote",
      description:
        getQuoteDescription(workflow),
      state:
        currentIndex > 2
          ? "COMPLETE"
          : currentIndex === 2
            ? "CURRENT"
            : "UPCOMING",
      icon: FileText,
    },

    {
      id: "DELIVERY",
      label: "Delivery",
      description:
        getDeliveryDescription(workflow),
      state:
        workflow.stage === "COMPLETED"
          ? "COMPLETE"
          : currentIndex === 3
            ? "CURRENT"
            : "UPCOMING",
      icon: GraduationCap,
    },
  ];
}

export function BookingProgress({
  booking,
  workflow,
}: BookingProgressProps) {
  const steps = getSteps(
    booking,
    workflow
  );

  return (
    <section
      aria-label="Booking progress"
      className="rounded-lg border bg-card"
    >
      {/* Desktop */}

      <div className="hidden md:block">
        <div className="grid grid-cols-4">
          {steps.map((step, index) => (
            <DesktopStep
              key={step.id}
              step={step}
              isFirst={index === 0}
              isLast={
                index === steps.length - 1
              }
            />
          ))}
        </div>
      </div>

      {/* Mobile */}

      <div className="md:hidden">
        <MobileProgress steps={steps} />
      </div>
    </section>
  );
}

function DesktopStep({
  step,
  isFirst,
  isLast,
}: {
  step: ProgressStep;
  isFirst: boolean;
  isLast: boolean;
}) {
  const Icon = step.icon;

  const complete =
    step.state === "COMPLETE";

  const current =
    step.state === "CURRENT";

  const blocked =
    step.state === "BLOCKED";

  return (
    <div className="relative px-4 py-5">
      {/* Connector */}

      {!isFirst && (
        <div
          className={`absolute left-0 top-8 h-px w-[calc(50%-20px)] ${
            complete ||
            current
              ? "bg-primary"
              : "bg-border"
          }`}
        />
      )}

      {!isLast && (
        <div
          className={`absolute right-0 top-8 h-px w-[calc(50%-20px)] ${
            complete
              ? "bg-primary"
              : "bg-border"
          }`}
        />
      )}

      <div className="relative z-10 flex flex-col items-center text-center">
        <div
          className={[
            "flex size-7 items-center justify-center rounded-full border",
            complete
              ? "border-primary bg-primary text-primary-foreground"
              : "",
            current
              ? "border-primary bg-background text-primary"
              : "",
            step.state ===
            "UPCOMING"
              ? "border-border bg-background text-muted-foreground"
              : "",
            blocked
              ? "border-destructive bg-destructive/10 text-destructive"
              : "",
          ].join(" ")}
        >
          {complete ? (
            <Check className="size-3.5" />
          ) : blocked ? (
            <X className="size-3.5" />
          ) : (
            <Icon className="size-3.5" />
          )}
        </div>

        <div className="mt-2">
          <div
            className={[
              "text-sm font-medium",
              current
                ? "text-foreground"
                : "",
              complete
                ? "text-foreground"
                : "",
              step.state ===
              "UPCOMING"
                ? "text-muted-foreground"
                : "",
              blocked
                ? "text-destructive"
                : "",
            ].join(" ")}
          >
            {step.label}
          </div>

          <div className="mt-0.5 text-xs text-muted-foreground">
            {step.description}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileProgress({
  steps,
}: {
  steps: ProgressStep[];
}) {
  const activeStep =
    steps.find(
      ({ state }) =>
        state === "CURRENT" ||
        state === "BLOCKED"
    ) ??
    steps[steps.length - 1];

  const activeIndex =
    steps.findIndex(
      ({ id }) =>
        id === activeStep.id
    );

  const completedCount =
    steps.filter(
      ({ state }) =>
        state === "COMPLETE"
    ).length;

  const progress =
    activeStep.state === "BLOCKED"
      ? 0
      : activeStep.state ===
          "COMPLETE"
        ? 100
        : Math.max(
            10,
            (completedCount /
              steps.length) *
              100
          );

  const Icon = activeStep.icon;

  return (
    <div className="p-4">
      <div className="flex items-center gap-3">
        <div
          className={[
            "flex size-9 shrink-0 items-center justify-center rounded-full border",
            activeStep.state ===
            "BLOCKED"
              ? "border-destructive bg-destructive/10 text-destructive"
              : "border-primary bg-primary/5 text-primary",
          ].join(" ")}
        >
          {activeStep.state ===
          "BLOCKED" ? (
            <X className="size-4" />
          ) : (
            <Icon className="size-4" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium">
                {activeStep.label}
              </p>

              <p className="truncate text-xs text-muted-foreground">
                {activeStep.description}
              </p>
            </div>

            <span className="shrink-0 text-xs text-muted-foreground">
              {activeIndex + 1} of{" "}
              {steps.length}
            </span>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width]"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}