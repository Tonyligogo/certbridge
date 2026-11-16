
"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import {
  CalendarDays,
  GraduationCap,
  Loader2,
  Users,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import type { AdminEnquiryDetail } from "../types";
import { convertEnquirySchema, type ConvertEnquiryInput, } from "../lib/validation/enquiry";
import { calculateBookingPrice, TRAINER_DAILY_RATES } from "@/lib/pricing-config";
import { toast } from "sonner";


interface ConvertEnquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enquiry?: AdminEnquiryDetail | null;
  isSubmitting?: boolean;
  onConfirm: (input: ConvertEnquiryInput) => Promise<void>;
}

const DELIVERY_MODES = [
  { value: "ONLINE", label: "Online" },
  { value: "CLIENT_SITE", label: "Client site" },
  { value: "ARRANGED_VENUE", label: "Arranged venue" },
] as const;

function formatDate(value: string | Date) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function calculateEndDate(
  startDate: string | Date,
  durationDays: number,
) {
  const date = new Date(startDate);

  date.setUTCDate(date.getUTCDate() + durationDays - 1);

  return date;
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ConvertEnquiryDialog({
  open,
  onOpenChange,
  enquiry,
  isSubmitting = false,
  onConfirm,
}: ConvertEnquiryDialogProps) {
  const form = useForm<ConvertEnquiryInput>({
    resolver: zodResolver(convertEnquirySchema),
    defaultValues: {
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      organizationName: "",
      participantCount: 1,
      deliveryMode: "ONLINE",
      specialRequirements: "",
      locationAddress: "",
      locationCity: "",
      locationCountry: "",
      locationNotes: "",
    },
  });

  useEffect(() => {
    if (!open || !enquiry) return;

    form.reset({
      contactName: enquiry.fullName,
      contactEmail: enquiry.email,
      contactPhone: enquiry.phone ?? "",
      organizationName: enquiry.organization ?? "",
      participantCount: enquiry.participantCount ?? 1,
      deliveryMode: enquiry.deliveryMode ?? "ONLINE",
      specialRequirements: enquiry.message ?? "",
      locationAddress: "",
      locationCity: "",
      locationCountry: "",
      locationNotes: "",
    });
  }, [open, enquiry, form]);

  const participantCount = useWatch({
  control: form.control,
  name: "participantCount",
});

const deliveryMode = useWatch({
  control: form.control,
  name: "deliveryMode",
});

  const course = enquiry?.course;

  const estimate = useMemo(() => {
    if (!course) return null;

    const selectedPricing = course.pricing.find(
      (price) => price.deliveryMode === deliveryMode,
    );

    if (!selectedPricing) return null;

    if (
      !Number.isInteger(participantCount) ||
      participantCount < 1 ||
      participantCount > 30
    ) {
      return null;
    }

    try {
      return calculateBookingPrice({
        basePricePerParticipantPerDay: Number(
          selectedPricing.amount,
        ),
        participants: participantCount,
        durationDays: course.durationDays,
        deliveryMode,
        currency: selectedPricing.currency,
        trainerDailyRate: TRAINER_DAILY_RATES[course.level],
      });
    } catch {
      return null;
    }
  }, [course, participantCount, deliveryMode]);

  const preferredStartDate = enquiry?.preferredDate ?? null;

  const preferredEndDate =
    preferredStartDate && course
      ? calculateEndDate(
          preferredStartDate,
          course.durationDays,
        )
      : null;

  const canSubmit =
    Boolean(course) &&
    Boolean(preferredStartDate) &&
    Boolean(estimate) &&
    !isSubmitting;

  const errors = form.formState.errors;

  async function handleSubmit(input: ConvertEnquiryInput) {
    if (!canSubmit) {
        toast.error("Cannot submit the form. Please provide all the details and try again.");
        return;
    }

    await onConfirm(input);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isSubmitting) return;
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Convert to booking</DialogTitle>
          <DialogDescription>
            Review the enquiry information and confirm the
            booking details.
          </DialogDescription>
        </DialogHeader>

        {!enquiry || !course ? (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="text-sm font-medium">
              No course linked to this enquiry
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Course selection will be available in the
              next stage.
            </p>
          </div>
        ) : (
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            {/* Selected course */}
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Selected course
                </p>
                <span className="rounded-full bg-background px-2 py-1 text-xs text-muted-foreground">
                  Linked to enquiry
                </span>
              </div>

              <h3 className="font-semibold">{course.title}</h3>

              <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" />
                  {course.durationDays} days
                </span>
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="size-3.5" />
                  {course.level.replaceAll("_", " ")}
                </span>
              </div>
            </div>

            {/* Contact information */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">
                Contact information
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="convert-name">Full name</Label>
                  <Input
                    id="convert-name"
                    {...form.register("contactName")}
                  />
                  {errors.contactName && (
                    <p className="text-xs text-destructive">
                      {errors.contactName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="convert-email">Email</Label>
                  <Input
                    id="convert-email"
                    type="email"
                    {...form.register("contactEmail")}
                  />
                  {errors.contactEmail && (
                    <p className="text-xs text-destructive">
                      {errors.contactEmail.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="convert-phone">Phone</Label>
                  <Input
                    id="convert-phone"
                    {...form.register("contactPhone")}
                  />
                  {errors.contactPhone && (
                    <p className="text-xs text-destructive">
                      {errors.contactPhone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="convert-organization">
                    Organization
                  </Label>
                  <Input
                    id="convert-organization"
                    {...form.register("organizationName")}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Training details */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">
                Training details
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="convert-participants">
                    Participants
                  </Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="convert-participants"
                      type="number"
                      min={1}
                      max={30}
                      className="pl-9"
                      {...form.register("participantCount", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  {errors.participantCount && (
                    <p className="text-xs text-destructive">
                      {errors.participantCount.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label>Delivery mode</Label>
                  <Select
                    value={deliveryMode}
                    onValueChange={(value) =>
                      form.setValue(
                        "deliveryMode",
                        value as ConvertEnquiryInput["deliveryMode"],
                        { shouldValidate: true },
                      )
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select delivery mode" />
                    </SelectTrigger>
                    <SelectContent>
                      {DELIVERY_MODES.map((mode) => (
                        <SelectItem
                          key={mode.value}
                          value={mode.value}
                        >
                          {mode.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Preferred dates */}
              <div className="space-y-1.5">
                <Label>Preferred training dates</Label>

                <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2.5 text-sm">
                  <CalendarDays className="size-4 text-muted-foreground" />

                  {preferredStartDate && preferredEndDate ? (
                    <span>
                      {formatDate(preferredStartDate)}
                      {" – "}
                      {formatDate(preferredEndDate)}
                    </span>
                  ) : (
                    <span className="text-destructive">
                      Preferred training date is missing
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Requirements */}
            <div className="space-y-1.5">
              <Label htmlFor="convert-requirements">
                Special requirements
              </Label>
              <Textarea
                id="convert-requirements"
                rows={3}
                placeholder="Additional training requirements..."
                {...form.register("specialRequirements")}
              />
            </div>

            {/* Location details */}
            {deliveryMode !== "ONLINE" && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">
                  Location details
                </h3>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>City</Label>
                    <Input {...form.register("locationCity")} />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Country</Label>
                    <Input {...form.register("locationCountry")} />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Address</Label>
                    <Input {...form.register("locationAddress")} />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Location notes</Label>
                    <Textarea
                      rows={2}
                      {...form.register("locationNotes")}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Pricing */}
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">
                Estimated booking amount
              </p>

              {estimate ? (
                <>
                  <p className="mt-1 text-2xl font-bold tracking-tight">
                    {formatMoney(
                      estimate.totalPrice,
                      estimate.currency,
                    )}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {estimate.participants} participants
                    {" · "}
                    {estimate.durationDays} days
                    {" · "}
                    {formatMoney(
                      estimate.pricePerParticipant,
                      estimate.currency,
                    )}{" "}
                    per participant
                  </p>
                </>
              ) : (
                <p className="mt-2 text-sm text-destructive">
                  Unable to calculate pricing for the
                  selected details.
                </p>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={!canSubmit}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Creating booking...
                  </>
                ) : (
                  "Create booking"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
