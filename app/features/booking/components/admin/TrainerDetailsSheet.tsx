"use client";

import {
  Award,
  BriefcaseBusiness,
  LucideIcon,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import type { AdminBookingDetailsResponse } from "../../types/admin-booking";
import { ReactNode } from "react";
import { formatDate, formatEnum, formatMoney } from "../../utils/utils";

type TrainerAssignment = AdminBookingDetailsResponse["trainers"][number];

interface TrainerDetailsSheetProps {
  assignment: TrainerAssignment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TrainerDetailsSheet({
  assignment,
  open,
  onOpenChange,
}: TrainerDetailsSheetProps) {
  if (!assignment) return null;

  const { trainer } = assignment;

  const fullName = [
    trainer.firstName,
    trainer.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
    >
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-lg"
      >
        <SheetHeader className="border-b px-6 py-5 text-left">
          <SheetTitle>Trainer Details</SheetTitle>

          <SheetDescription>
            Trainer profile and assignment details for
            this booking.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Trainer */}
          <div className="px-6 py-6">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted">
                <UserRound className="size-5 text-muted-foreground" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold">
                    {fullName}
                  </h3>

                  {trainer.certified && (
                    <Badge variant="secondary">
                      <Award className="mr-1 size-3" />
                      Certified
                    </Badge>
                  )}
                </div>

                {trainer.expertise && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {trainer.expertise}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact */}
          <Section title="Contact information">
            <DetailRow
              icon={Mail}
              label="Email"
              value={trainer.email}
            />

            <DetailRow
              icon={Phone}
              label="Phone"
              value={trainer.phone}
            />

            <DetailRow
              icon={MapPin}
              label="Location"
              value={
                [
                  trainer.primaryCity,
                  trainer.primaryCountry,
                ]
                  .filter(Boolean)
                  .join(", ") || "Not provided"
              }
            />
          </Section>

          <Separator />

          {/* Professional */}
          <Section title="Professional information">
            <DetailRow
              icon={BriefcaseBusiness}
              label="Experience"
              value={
                trainer.yearsOfExperience != null
                  ? `${trainer.yearsOfExperience} ${
                      trainer.yearsOfExperience === 1
                        ? "year"
                        : "years"
                    }`
                  : "Not provided"
              }
            />
          </Section>

          <Separator />

          {/* Assignment */}
          <Section title="Booking assignment">
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoBlock
                label="Assignment status"
                value={formatEnum(assignment.status)}
              />

              <InfoBlock
                label="Role"
                value={formatEnum(assignment.role)}
              />

              <InfoBlock
                label="Agreed amount"
                value={formatMoney(
                  Number(assignment.agreedAmount),
                  assignment.currency
                )}
              />

              <InfoBlock
                label="Confirmed"
                value={
                  assignment.confirmedAt
                    ? formatDate(
                        assignment.confirmedAt
                      )
                    : "Not confirmed"
                }
              />
            </div>

            {assignment.notes && (
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Assignment notes
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm">
                  {assignment.notes}
                </p>
              </div>
            )}
          </Section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4 px-6 py-6">
      <h4 className="text-sm font-semibold">
        {title}
      </h4>

      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
}

export function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">
          {label}
        </p>

        <div className="mt-0.5 wrap-break-word text-sm font-medium">
          {value}
        </div>
      </div>
    </div>
  );
}

export function InfoBlock({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <div className="mt-1 text-sm font-medium">
        {value}
      </div>
    </div>
  );
}