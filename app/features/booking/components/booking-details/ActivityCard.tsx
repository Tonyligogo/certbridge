import {
  Activity,
  ChevronRight,
  Banknote,
  CalendarCheck2,
  CalendarClock,
  CheckCircle2,
  Circle,
  FileCheck2,
  FilePenLine,
  FileText,
  Mail,
  MapPin,
  NotebookPen,
  ReceiptText,
  UserRoundCheck,
  UserRoundMinus,
  UserRoundPlus,
  UserRoundSearch,
  UsersRound,
  XCircle,
  LucideIcon,
  PencilLine,
  Undo2,
  Ban,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AdminBookingDetailsResponse } from "../../types/admin-booking";


interface ActivityCardProps {
  booking: AdminBookingDetailsResponse;
  onViewAll?: () => void;
}

const VISIBLE_ACTIVITIES = 5;

export function ActivityCard({
  booking,
  onViewAll,
}: ActivityCardProps) {
  const activities =
    booking.activities;

  const visibleActivities =
    activities.slice(
      0,
      VISIBLE_ACTIVITIES
    );

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-base">
            Activity
          </CardTitle>

          {activities.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {activities.length}{" "}
              {activities.length === 1
                ? "activity"
                : "activities"}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {activities.length === 0 ? (
          <EmptyActivity />
        ) : (
          <>
            <ActivityTimeline
              activities={
                visibleActivities
              }
            />

            {activities.length >
              VISIBLE_ACTIVITIES && (
              <div className="mt-4 border-t pt-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={onViewAll}
                >
                  View all activity

                  <ChevronRight className="ml-2 size-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

type BookingActivity =
  AdminBookingDetailsResponse["activities"][number];

function ActivityTimeline({
  activities,
}: {
  activities: BookingActivity[];
}) {
  return (
    <div>
      {activities.map(
        (activity, index) => {
          const last =
            index ===
            activities.length - 1;

          return (
            <ActivityTimelineItem
              key={activity.id}
              activity={activity}
              last={last}
            />
          );
        }
      )}
    </div>
  );
}

function ActivityTimelineItem({
  activity,
  last,
}: {
  activity: BookingActivity;
  last: boolean;
}) {
  const config =
    getActivityConfig(
      activity.type
    );

  const Icon = config.icon;

  return (
    <div className="relative flex gap-3">
      {/* Timeline marker */}
      <div className="relative flex shrink-0 flex-col items-center">
        <div
          className={`relative z-10 flex size-8 items-center justify-center rounded-full ${config.iconClassName}`}
        >
          <Icon className="size-3.5" />
        </div>

        {!last && (
          <div className="absolute bottom-0 top-8 w-px bg-border" />
        )}
      </div>

      {/* Content */}
      <div
        className={
          last
            ? "min-w-0 flex-1 pb-1"
            : "min-w-0 flex-1 pb-6"
        }
      >
        <div className="flex gap-2 justify-between">
           <p className="text-sm font-medium">
          {config.label}
        </p>
          <time
            title={formatActivityDate(
              activity.createdAt
            )}
          >
            {formatRelativeActivityDate(
              activity.createdAt
            )}
          </time>
        </div>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">
          {activity.description}
        </p>
      </div>
    </div>
  );
}

function getActivityConfig(
  type: BookingActivityType
): ActivityConfig {
  return (
    activityConfig[type] ?? {
      label: humanizeActivityType(
        type
      ),
      icon: Circle,
      iconClassName:
        "bg-muted text-muted-foreground",
    }
  );
}

function humanizeActivityType(
  value: string
) {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

export function formatRelativeActivityDate(
  value: string,
  now = new Date()
) {
  const date = new Date(value);

  const differenceMs =
    now.getTime() -
    date.getTime();

  const differenceMinutes =
    Math.floor(
      differenceMs / 60_000
    );

  if (
    differenceMinutes >= 0 &&
    differenceMinutes < 1
  ) {
    return "Just now";
  }

  if (
    differenceMinutes >= 1 &&
    differenceMinutes < 60
  ) {
    return `${differenceMinutes} min ago`;
  }

  const differenceHours =
    Math.floor(
      differenceMinutes / 60
    );

  if (
    differenceHours >= 1 &&
    differenceHours < 24
  ) {
    return `${differenceHours} ${
      differenceHours === 1
        ? "hour"
        : "hours"
    } ago`;
  }

  const today =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

  const activityDay =
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

  const dayDifference =
    Math.round(
      (today.getTime() -
        activityDay.getTime()) /
        86_400_000
    );

  if (dayDifference === 1) {
    return `Yesterday, ${formatActivityTime(
      date
    )}`;
  }

  if (
    date.getFullYear() ===
    now.getFullYear()
  ) {
    return new Intl.DateTimeFormat(
      "en-GB",
      {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }
    ).format(date);
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}

function formatActivityTime(
  date: Date
) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}

function formatActivityDate(
  value: string
) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(new Date(value));
}

function EmptyActivity() {
  return (
    <div className="rounded-lg border border-dashed px-4 py-8 text-center">
      <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-muted">
        <Activity className="size-5 text-muted-foreground" />
      </div>

      <p className="mt-3 text-sm font-medium">
        No activity yet
      </p>

      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
        Booking events and operational
        changes will appear here as the
        booking progresses.
      </p>
    </div>
  );
}

import type {
  BookingActivityType,
} from "@/generated/prisma/enums";

type ActivityConfig = {
  label: string;
  icon: LucideIcon;
  iconClassName: string;
};

const activityConfig = {
  CREATED: {
    label: "Booking created",
    icon: CalendarCheck2,
    iconClassName:
      "bg-slate-100 text-slate-600",
  },

  STATUS_CHANGED: {
    label: "Status changed",
    icon: Circle,
    iconClassName:
      "bg-blue-50 text-blue-700",
  },

  TRAINER_ADDED: {
    label: "Trainer added",
    icon: UserRoundPlus,
    iconClassName:
      "bg-blue-50 text-blue-700",
  },

  TRAINER_CONTACTED: {
    label: "Trainer contacted",
    icon: UserRoundSearch,
    iconClassName:
      "bg-blue-50 text-blue-700",
  },

  TRAINER_CONFIRMED: {
    label: "Trainer confirmed",
    icon: UserRoundCheck,
    iconClassName:
      "bg-emerald-50 text-emerald-700",
  },

  TRAINER_REMOVED: {
    label: "Trainer removed",
    icon: UserRoundMinus,
    iconClassName:
      "bg-slate-100 text-slate-600",
  },

  TRAINER_REPLACED: {
    label: "Trainer replaced",
    icon: UsersRound,
    iconClassName:
      "bg-amber-50 text-amber-700",
  },

  VENUE_ADDED: {
    label: "Venue added",
    icon: MapPin,
    iconClassName:
      "bg-blue-50 text-blue-700",
  },

  VENUE_CONTACTED: {
    label: "Venue contacted",
    icon: MapPin,
    iconClassName:
      "bg-blue-50 text-blue-700",
  },

  VENUE_CONFIRMED: {
    label: "Venue confirmed",
    icon: MapPin,
    iconClassName:
      "bg-emerald-50 text-emerald-700",
  },

  VENUE_REMOVED: {
    label: "Venue removed",
    icon: MapPin,
    iconClassName:
      "bg-slate-100 text-slate-600",
  },

  VENUE_REPLACED: {
    label: "Venue replaced",
    icon: MapPin,
    iconClassName:
      "bg-amber-50 text-amber-700",
  },

  QUOTE_CREATED: {
    label: "Quote created",
    icon: FileText,
    iconClassName:
      "bg-slate-100 text-slate-600",
  },

  QUOTE_UPDATED: {
    label: "Quote updated",
    icon: FilePenLine,
    iconClassName:
      "bg-blue-50 text-blue-700",
  },

  QUOTE_SENT: {
    label: "Quote sent",
    icon: FileText,
    iconClassName:
      "bg-blue-50 text-blue-700",
  },

  QUOTE_ACCEPTED: {
    label: "Quote accepted",
    icon: FileCheck2,
    iconClassName:
      "bg-emerald-50 text-emerald-700",
  },

  QUOTE_DECLINED: {
    label: "Quote declined",
    icon: XCircle,
    iconClassName:
      "bg-rose-50 text-rose-700",
  },

  SCHEDULED: {
    label: "Training scheduled",
    icon: CalendarCheck2,
    iconClassName:
      "bg-emerald-50 text-emerald-700",
  },

  RESCHEDULED: {
    label: "Training rescheduled",
    icon: CalendarClock,
    iconClassName:
      "bg-amber-50 text-amber-700",
  },

  CLIENT_CONTACTED: {
    label: "Client contacted",
    icon: Mail,
    iconClassName:
      "bg-blue-50 text-blue-700",
  },

  NOTE_ADDED: {
    label: "Note added",
    icon: NotebookPen,
    iconClassName:
      "bg-slate-100 text-slate-600",
  },

  CANCELLED: {
    label: "Booking cancelled",
    icon: XCircle,
    iconClassName:
      "bg-rose-50 text-rose-700",
  },

  COMPLETED: {
    label: "Booking completed",
    icon: CheckCircle2,
    iconClassName:
      "bg-emerald-50 text-emerald-700",
  },

  // --------------------------------------------------
  // Invoices
  // --------------------------------------------------

  INVOICE_CREATED: {
    label: "Invoice created",
    icon: ReceiptText,
    iconClassName:
      "bg-blue-50 text-blue-700",
  },

  INVOICE_UPDATED: {
    label: "Invoice updated",
    icon: FilePenLine,
    iconClassName:
      "bg-blue-50 text-blue-700",
  },

  INVOICE_ISSUED: {
    label: "Invoice issued",
    icon: Send,
    iconClassName:
      "bg-blue-50 text-blue-700",
  },

  INVOICE_VOIDED: {
    label: "Invoice voided",
    icon: Ban,
    iconClassName:
      "bg-rose-50 text-rose-700",
  },

  // --------------------------------------------------
  // Payments
  // --------------------------------------------------

  PAYMENT_RECEIVED: {
    label: "Payment received",
    icon: Banknote,
    iconClassName:
      "bg-emerald-50 text-emerald-700",
  },

  PAYMENT_UPDATED: {
    label: "Payment updated",
    icon: PencilLine,
    iconClassName:
      "bg-blue-50 text-blue-700",
  },

  PAYMENT_REFUNDED: {
    label: "Payment refunded",
    icon: Undo2,
    iconClassName:
      "bg-amber-50 text-amber-700",
  },
} satisfies Record<
  BookingActivityType,
  ActivityConfig
>;