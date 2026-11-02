
import { Info } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { formatMoney } from "../lib/pricing";

interface PriceEstimate {
  participants: number;
  durationDays: number;
  currency: string;
  totalPrice: number;
  pricePerParticipant: number;
  pricePerParticipantPerDay: number;
}

export function PriceEstimateCard({
  estimate,
}: {
  estimate: PriceEstimate | null;
}) {
  if (!estimate || estimate.totalPrice <= 0) {
    return (
      <Card>
        <CardContent className="flex items-start gap-2 py-5 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0" />
          <p>
            Please contact our team for pricing information.
          </p>
        </CardContent>
      </Card>
    );
  }

  const {
    participants,
    durationDays,
    currency,
    totalPrice,
  } = estimate;

  // Use the effective rate, not the stored reference price.
  const effectiveDailyRate =
    totalPrice / (participants * durationDays);

  const formattedRate = formatMoney(
    effectiveDailyRate,
    currency
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">
            Estimated training cost
          </CardTitle>

          <Badge variant="secondary" className="text-[10px]">
            Excl. VAT
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        <div className="space-y-3">
          <Row
            label="Price per participant / day"
            value={formattedRate}
          />

          <Row
            label="Participants"
            value={String(participants)}
          />

          <Row
            label="Duration"
            value={`${durationDays} ${
              durationDays === 1 ? "day" : "days"
            }`}
          />
        </div>

        <Separator />

        <div className="flex items-baseline justify-between gap-3">
          <span className="font-semibold">
            Estimated total
          </span>

          <span className="font-display text-xl font-bold tabular-nums">
            {formatMoney(totalPrice, currency)}
          </span>
        </div>

        <div className="flex items-start gap-2 rounded-lg bg-muted/40 p-3">
          <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

          <p className="text-xs leading-relaxed text-muted-foreground">
            This estimate excludes VAT. Your final quotation
            will confirm the total amount, including applicable
            taxes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">
        {label}
      </span>

      <span className="font-medium tabular-nums">
        {value}
      </span>
    </div>
  );
}
