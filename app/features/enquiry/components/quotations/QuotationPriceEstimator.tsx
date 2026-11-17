"use client";

import { useMemo, useState } from "react";
import { Calculator, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CourseLevel, DeliveryMode } from "@/generated/prisma/enums";
import {
  calculateBasePrice,
  calculateBookingPrice,
  TRAINER_DAILY_RATES,
} from "@/lib/pricing-config";
import type { AdminEnquiryDetail } from "../../types";

export type AppliedQuotationEstimate = {
  name: string;
  unitPrice: string;
  currency: string;
};

type Props = {
  enquiry: AdminEnquiryDetail;
  onApply: (estimate: AppliedQuotationEstimate) => void;
  quotationCurrency: string;
  disabled?: boolean;
  initiallyExpanded?: boolean;
};

const formatMoney = (amount: number, currency: string) =>
  `${currency} ${new Intl.NumberFormat("en-KE", { maximumFractionDigits: 2 }).format(amount)}`;

const deliveryLabels: Record<DeliveryMode, string> = {
  ONLINE: "Online",
  CLIENT_SITE: "Client site",
  ARRANGED_VENUE: "Arranged venue",
};

const levelLabels: Record<CourseLevel, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  ALL_LEVELS: "All levels",
};

export function QuotationPriceEstimator({
  enquiry,
  onApply,
  quotationCurrency,
  disabled = false,
  initiallyExpanded = true,
}: Props) {
  const course = enquiry.course;
  const hasLinkedCourse = Boolean(course);
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const [participants, setParticipants] = useState(
    String(enquiry.participantCount ?? 1),
  );
  const [days, setDays] = useState(String(course?.durationDays ?? 1));
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>(
    enquiry.deliveryMode ?? DeliveryMode.ONLINE,
  );
  const [manualLevel, setManualLevel] = useState<CourseLevel>(
    CourseLevel.ALL_LEVELS,
  );
  const [customBasePrice, setCustomBasePrice] = useState<string | null>(null);
  const [manualTitle, setManualTitle] = useState(
    enquiry.courseName || "Training programme",
  );
  const [manualCurrency, setManualCurrency] = useState(quotationCurrency);

  const level = course?.level ?? manualLevel;
  const selectedPricing = course?.pricing?.find(
    (price) => price.deliveryMode === deliveryMode,
  );
  
  const suggestedPrices = useMemo(
  () => calculateBasePrice(manualLevel),
  [manualLevel],
);

const suggestedBasePrice = suggestedPrices[deliveryMode];

const minimumBasePrice = suggestedPrices[DeliveryMode.ONLINE];

  const basePriceInput = customBasePrice ?? String(suggestedBasePrice);

  const basePrice = course
    ? selectedPricing
      ? Number(selectedPricing.amount)
      : null
    : Number(basePriceInput);

  const currency = hasLinkedCourse
    ? (selectedPricing?.currency ?? quotationCurrency)
    : manualCurrency.trim().toUpperCase();

  const count = Number(participants);
  const duration = Number(days);
  const valid =
    Number.isInteger(count) &&
    count >= 1 &&
    count <= 30 &&
    Number.isInteger(duration) &&
    duration >= 1 &&
    basePrice !== null &&
    Number.isFinite(basePrice) &&
    basePrice > 0;

  const estimate = useMemo(() => {
    if (!valid || basePrice === null) return null;
    try {
      return calculateBookingPrice({
        basePricePerParticipantPerDay: basePrice,
        participants: count,
        durationDays: duration,
        deliveryMode,
        currency,
        trainerDailyRate: TRAINER_DAILY_RATES[level],
      });
    } catch {
      return null;
    }
  }, [valid, basePrice, count, duration, deliveryMode, currency, level]);

  const currencyMismatch = currency !== quotationCurrency;
  const title = course?.title ?? manualTitle.trim();

  return (
    <section
      className="rounded-xl border bg-card"
      aria-label="Quotation price estimator"
    >
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 p-4 text-left"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
      >
        <span className="flex items-center gap-2">
          <Calculator className="size-4 text-muted-foreground" />
          <span className="text-sm font-semibold">Price estimator</span>
        </span>
        {expanded ? (
          <ChevronUp className="size-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-4 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="space-y-4 px-4 pb-4">
          <p className="text-xs text-muted-foreground">
            Estimate the full training cost, then apply it to a quotation line
            item. Applying never happens automatically.
          </p>

          {course ? (
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-sm font-medium">{course.title}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="secondary">{levelLabels[course.level]}</Badge>
                <Badge variant="outline">
                  {course.durationDays} days default
                </Badge>
              </div>
            </div>
          ) : (
            <div className="space-y-3 rounded-lg bg-muted/30 p-3">
              <div className="space-y-1.5">
                <Label htmlFor="est-course-name">Training course</Label>
                <Input
                  id="est-course-name"
                  value={manualTitle}
                  onChange={(event) => setManualTitle(event.target.value)}
                  disabled={disabled}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Course level</Label>
                <Select
                  value={manualLevel}
                  onValueChange={(value) =>
                    setManualLevel(value as CourseLevel)
                  }
                  disabled={disabled}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(CourseLevel).map((value) => (
                      <SelectItem key={value} value={value}>
                        {levelLabels[value]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="est-base">Base price per day</Label>

                  <Input
                    id="est-base"
                    type="number"
                    min={minimumBasePrice}
                    step="100"
                    value={basePriceInput}
                    onChange={(e) => {
                      setCustomBasePrice(e.target.value);
                    }}
                    disabled={disabled}
                  />

                  <div className="flex justify-end">
                    {customBasePrice !== null && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-primary"
                        disabled={disabled}
                        onClick={() => setCustomBasePrice(null)}
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="est-currency">Currency</Label>
                  <Select
                    value={manualCurrency}
                    onValueChange={(value) => setManualCurrency(value)}
                    disabled={disabled}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KES">KES</SelectItem>
                      {/* <SelectItem value='USD'>USD</SelectItem> */}
                    </SelectContent>
                  </Select>
                  {/* <Input id="est-currency" value={manualCurrency} onChange={(event) => setManualCurrency(event.target.value.toUpperCase())} maxLength={3} disabled={disabled} /> */}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="est-participants">Participants (1–30)</Label>
              <Input
                id="est-participants"
                type="number"
                min={1}
                max={30}
                step={1}
                value={participants}
                onChange={(event) => setParticipants(event.target.value)}
                disabled={disabled}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="est-days">Training days</Label>
              <Input
                id="est-days"
                type="number"
                min={1}
                step={1}
                value={days}
                onChange={(event) => setDays(event.target.value)}
                disabled={disabled}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Delivery method</Label>
            <Select
              value={deliveryMode}
              onValueChange={(value) => setDeliveryMode(value as DeliveryMode)}
              disabled={disabled}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(DeliveryMode).map((value) => (
                  <SelectItem key={value} value={value}>
                    {deliveryLabels[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasLinkedCourse && !selectedPricing && (
            <p className="text-xs text-amber-700">
              No pricing configured for this delivery method.
            </p>
          )}
          <Separator />
          {estimate ? (
            <div className="space-y-2">
              <p className="text-2xl font-semibold tabular-nums">
                {formatMoney(estimate.totalPrice, estimate.currency)} <span className="text-sm font-normal text-muted-foreground">(not inclusive of tax)</span>
              </p>
              </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Enter valid pricing, 1–30 participants and at least one training
              day to see an estimate.
            </p>
          )}
          {currencyMismatch && (
            <p className="text-xs text-destructive">
              The estimate uses {currency}, but the quotation uses{" "}
              {quotationCurrency}. Currency conversion is not supported; choose
              matching pricing before applying.
            </p>
          )}
          <Button
            type="button"
            className="w-full"
            disabled={disabled || !estimate || currencyMismatch || !title}
            onClick={() => {
              if (!estimate || !title || currencyMismatch) return;
              onApply({
                name: title,
                unitPrice: estimate.totalPrice.toFixed(2),
                currency: estimate.currency,
              });
              toast.success("Estimated price applied to quotation");
            }}
          >
            Apply estimated price
          </Button>
        </div>
      )}
    </section>
  );
}
