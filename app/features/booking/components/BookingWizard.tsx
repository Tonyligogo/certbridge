'use client'
import { useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowLeft, ArrowRight, Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  bookingRequestSchema,
  contactSchema,
  participantSchema,
} from "../lib/booking-schema";
import { BookingConfirmation } from "./BookingConfirmation";
import {
  draftToRequest,
  emptyDraft,
  prefillFirstParticipant,
  type BookingDraft,
  type DraftPatch,
  type FieldErrors,
} from "../types";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BOOKING_STEPS, StepIndicator } from "./StepIndicator";
import { ContactStep } from "./ContactStep";
import { ParticipantsStep } from "./ParticipantsStep";
import { TrainingDetailsStep } from "./TrainingDetailsStep";
import { ScheduleLocationStep } from "./ScheduleLocationStep";
import { ReviewStep } from "./ReviewStep";
import { PriceEstimateCard } from "./PriceEstimateCard";
import { useCreateBooking } from "../hooks/use-booking";
import { ConfirmedBooking } from "../services/booking";
import type { Course } from "@/app/features/course-catalog/types/catalogue";
import { useSearchParams } from "next/navigation";
import { DeliveryMode } from "@/generated/prisma/enums";
import { calculateBookingPrice } from "@/lib/pricing-config";

interface Prefill {
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  organizationName?: string | null;
}

export function BookingWizard({
  course,
  prefill,
  isSignedIn,
}: {
  course: Course;
  prefill?: Prefill | null | undefined;
  isSignedIn: boolean;
}) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [confirmation, setConfirmation] = useState<ConfirmedBooking | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const prefilled = useRef(false);
  const {mutate: submitBooking, isPending:isSubmitting} = useCreateBooking();
  const paramsDeliveryMode = useSearchParams().get("deliveryMode") as string | null;

  const [draft, setDraft] = useState<BookingDraft>(() => {
    const base = emptyDraft();
    // Default delivery mode from course pricing if available
    if (course.pricing) {
      base.deliveryMode = course.pricing?.find((price)=>price.deliveryMode === paramsDeliveryMode)?.deliveryMode ?? DeliveryMode.ARRANGED_VENUE;
    }
    return base
  });

  // Prefill contact details for signed-in customers without clobbering manual edits
  useEffect(() => {
    if (prefilled.current || !prefill) return;
    prefilled.current = true;

    const contactFullName =
      prefill.fullName ||
      [prefill.firstName, prefill.lastName].filter(Boolean).join(" ");

    setDraft((prev) => ({
      ...prev,
      contactName: prev.contactName || contactFullName || "",
      contactEmail: prev.contactEmail || prefill.email || "",
      contactPhone: prev.contactPhone || prefill.phone || "",
      organizationName: prev.organizationName || prefill.organizationName || "",
      participants: prev.participants.map((p, i) =>
        i === 0
          ? {
              ...p,
              firstName: p.firstName || prefill.firstName || "",
              lastName: p.lastName || prefill.lastName || "",
              email: p.email || prefill.email || "",
              phone: p.phone || prefill.phone || "",
            }
          : p
      ),
    }));
  }, [prefill]); 
  
  useEffect(() => {
    if (Object.keys(errors).length === 0) return;
  
    const timeout = setTimeout(() => {
      setErrors({});
    }, 4000);
  
    return () => clearTimeout(timeout);
  }, [errors]);

  const participantCount = draft.participants.length;
  const deliveryMode = draft.deliveryMode;
  const durationDays = course.durationDays;

  const selectedPricing = course.pricing.find(
    (price) => price.deliveryMode === deliveryMode
  );
  const basePrice = selectedPricing
    ? Number(selectedPricing.amount)
    : null;

  const estimate =
    participantCount > 0 &&
    basePrice !== null &&
    Number.isFinite(basePrice)
      ? calculateBookingPrice({
          basePricePerParticipant: basePrice,
          participants: participantCount,
          durationDays: durationDays,
          deliveryMode,
          currency: selectedPricing!.currency,
        })
      : null;

  function patch(next: DraftPatch) {
    setDraft((prev) => ({ ...prev, ...next }));
    setErrors((prev) => {
      if (Object.keys(prev).length === 0) return prev;
      const remaining = { ...prev };
      for (const key of Object.keys(next)) delete remaining[key];
      return remaining;
    });
  }

  function validateStep(index: number): FieldErrors {
    const found: FieldErrors = {};

    if (index === 0) {
      const result = contactSchema.safeParse(draft);
      if (!result.success) {
        for (const issue of result.error.issues) {
          const key = issue.path.join(".");
          if (!found[key]) found[key] = issue.message;
        }
      }
    }

    if (index === 1) {
      if (draft.participants.length === 0) found["participants"] = "Add at least one participant";
      draft.participants.forEach((participant, i) => {
        const result = participantSchema.safeParse(participant);
        if (!result.success) {
          for (const issue of result.error.issues) {
            const key = `participants.${i}.${issue.path.join(".")}`;
            if (!found[key]) found[key] = issue.message;
          }
        }
      });
    }

    if (index === 2) {
      if (!draft.deliveryMode) found["deliveryMode"] = "Choose how the training should be delivered";
    }

    if (index === 3) {
      // Require venue details if training is in-person / client site
      if (draft.deliveryMode === "CLIENT_SITE" || draft.deliveryMode === "ARRANGED_VENUE") {
        if (!draft.locationCountry.trim()) found["locationCountry"] = "Country is required for this delivery mode";
        if (!draft.locationCity.trim()) found["locationCity"] = "City is required for this delivery mode";
      }
      
      const today = new Date().toISOString().slice(0, 10);
      if (draft.preferredStartDate && draft.preferredStartDate < today) {
        found["preferredStartDate"] = "Choose a date in the future";
      }
      if (
        draft.preferredStartDate &&
        draft.preferredEndDate &&
        draft.preferredEndDate < draft.preferredStartDate
      ) {
        found["preferredEndDate"] = "End date must be after the start date";
      }
    }

    return found;
  }

  function goTo(index: number) {
    setStep(index);
    setErrors({});
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function next() {
    const found = validateStep(step);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    if(step === 0){
      setDraft((prev) => prefillFirstParticipant(prev));
    }
    goTo(Math.min(step + 1, BOOKING_STEPS.length - 1));
  }

  async function handleSubmit() {
    if (isSubmitting) return;

    for (let i = 0; i < BOOKING_STEPS.length - 1; i++) {
      const found = validateStep(i);
      if (Object.keys(found).length > 0) {
        setErrors(found);
        setStep(i);
        return;
      }
    }

    const newDraft = {
      ...draft,
      quotedAmount: estimate?.totalPrice || 0,
    }

    const payload = draftToRequest(newDraft, course.id);
    const parsed = bookingRequestSchema.safeParse(payload);
    
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      setErrors({ form: first?.message ?? "Please review your details and try again." });
      return;
    }

    try {
      setErrors({});
      submitBooking(payload, {
        onSuccess: (result) => {
          setConfirmation(result ?? null);
        },
        onError: (err) => {
          setErrors({
            form: err instanceof Error ? err.message : "Something went wrong. Please try again.",
          });
        },
      });
    } catch (err) {
      setErrors({
        form: err instanceof Error ? err.message : "Something went wrong. Please try again.",
      });
    }
  }

  if (confirmation) return <BookingConfirmation confirmation={confirmation} estimate={estimate} />;

  const progress = ((step + 1) / BOOKING_STEPS.length) * 100;

  return (
    <div ref={topRef} className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-7">
          <div className="space-y-4">
            <Progress value={progress} aria-label="Booking progress" />
            <div className="flex items-center justify-between gap-3">
              <StepIndicator current={step} />
              <span className="shrink-0 text-sm text-muted-foreground">
                Step {step + 1} of {BOOKING_STEPS.length}
              </span>
            </div>
          </div>

          <div className="mt-7">
            {step === 0 && (
              <ContactStep draft={draft} errors={errors} onChange={patch} isSignedIn={isSignedIn} />
            )}
            {step === 1 && <ParticipantsStep draft={draft} errors={errors} onChange={patch} />}
            {step === 2 && (
              <TrainingDetailsStep draft={draft} errors={errors} onChange={patch} course={course} />
            )}
            {step === 3 && (
              <ScheduleLocationStep draft={draft} errors={errors} onChange={patch} />
            )}
            {step === 4 && <ReviewStep draft={draft} course={course} onEditStep={goTo} />}
          </div>

          {errors["form"] && (
            <Alert variant="destructive" className="mt-6">
              <AlertCircle className="size-4" />
              <AlertTitle>We couldn&apos;t send your request</AlertTitle>
              <AlertDescription>{errors["form"]}</AlertDescription>
            </Alert>
          )}

          <div className="mt-8 flex gap-3 justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => goTo(Math.max(step - 1, 0))}
              disabled={step === 0 || isSubmitting}
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>

            {step < BOOKING_STEPS.length - 1 ? (
              <Button type="button" size='lg' onClick={next}>
                Continue
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button type="button" size='lg' onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Sending request…
                  </>
                ) : (
                  <>
                    <Send className="size-4 mr-2" />
                    Send booking request
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24">
        <PriceEstimateCard estimate={estimate} />
        <p className="text-xs text-muted-foreground">
          Submitting sends a request only. No payment is taken and nothing is confirmed until our team replies.
        </p>
      </aside>
    </div>
  );
}