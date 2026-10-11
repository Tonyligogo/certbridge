import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { BookingWorkflow, BookingWorkflowAction } from "../../types";

interface NextActionsCardProps {
  workflow: BookingWorkflow;

  onAction: (
    action: BookingWorkflowAction
  ) => void;
}

export function NextActionsCard({
  workflow,
  onAction,
}: NextActionsCardProps) {
  const {
    primaryAction,
    actions,
  } = workflow;

  if (!primaryAction) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Next actions
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
              <CheckCircle2 className="size-4 text-muted-foreground" />
            </div>

            <div>
              <p className="text-sm font-medium">
                No action required
              </p>

              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                There are no immediate
                operational actions for this
                booking.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const secondaryActions =
    actions
      .slice(1)
      .filter(
        (action) =>
          action.kind === "ACTION"
      );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          Next actions
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <PrimaryAction
          action={primaryAction}
          onAction={onAction}
        />

        {secondaryActions.length > 0 && (
          <div className="border-t pt-3">
            <div className="space-y-1">
              {secondaryActions.map(
                (action) => (
                  <Button
                    key={action.type}
                    type="button"
                    variant="ghost"
                    className="h-auto w-full justify-between px-2 py-2.5"
                    onClick={() =>
                      onAction(action)
                    }
                  >
                    <span className="text-sm">
                      {action.label}
                    </span>

                    <ArrowRight className="size-3.5 text-muted-foreground" />
                  </Button>
                )
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PrimaryAction({
  action,
  onAction,
}: {
  action: BookingWorkflowAction;

  onAction: (
    action: BookingWorkflowAction
  ) => void;
}) {
  const actionable =
    action.kind === "ACTION";

  const waiting =
    action.kind === "WAITING";

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div
          className={[
            "flex size-9 shrink-0 items-center justify-center rounded-full",

            actionable
              ? "bg-primary/10 text-primary"
              : "",

            waiting
              ? "bg-amber-50 text-amber-700"
              : "",

            action.kind === "INFO"
              ? "bg-muted text-muted-foreground"
              : "",
          ].join(" ")}
        >
          {waiting ? (
            <Clock3 className="size-4" />
          ) : action.kind === "INFO" ? (
            <Info className="size-4" />
          ) : (
            <ArrowRight className="size-4" />
          )}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium">
            {action.label}
          </p>

          <p className="mt-1 text-sm leading-5 text-muted-foreground">
            {action.description}
          </p>
        </div>
      </div>

      {actionable && (
        <Button
          type="button"
          className="w-full"
          onClick={() =>
            onAction(action)
          }
        >
          {action.label}

          <ArrowRight className="ml-2 size-4" />
        </Button>
      )}
    </div>
  );
}