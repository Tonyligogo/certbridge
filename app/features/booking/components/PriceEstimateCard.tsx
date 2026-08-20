import { Info } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatMoney, type PriceEstimate } from "../lib/pricing";

// Extend the PriceEstimate type locally to support optional pricing features safely
export type ExtendedPriceEstimate = PriceEstimate & {
  surcharge?: number;
  discountPercent?: number | null;
  discountAmount?: number;
};

export function PriceEstimateCard({ estimate }: { estimate: ExtendedPriceEstimate }) {
  const isAvailable = estimate.available && estimate.totalAmount != null;
  const participantCount = estimate.participantCount ?? 0;
  const rate = estimate.ratePerParticipant ?? 0;
  const total = estimate.totalAmount ?? 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Estimated price</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {isAvailable ? (
          <>
            <Row
              label={`${participantCount} × ${formatMoney(rate, estimate.currency)}`}
              value={formatMoney(participantCount * rate, estimate.currency)}
            />

            {estimate.surcharge != null && estimate.surcharge > 0 && (
              <Row
                label="Delivery surcharge"
                value={formatMoney(estimate.surcharge, estimate.currency)}
              />
            )}

            {estimate.discountPercent != null &&
              estimate.discountAmount != null &&
              estimate.discountAmount > 0 && (
                <Row
                  label={`Group saving (${estimate.discountPercent}%)`}
                  value={`− ${formatMoney(estimate.discountAmount, estimate.currency)}`}
                  accent
                />
              )}

            <Separator />

            <div className="flex items-baseline justify-between">
              <span className="font-medium">Estimated total</span>
              <span className="font-display text-xl font-semibold">
                {formatMoney(total, estimate.currency)}
              </span>
            </div>

            <p className="text-xs text-muted-foreground">
              Indicative only. Our team confirms the final price with you.
            </p>
          </>
        ) : (
          <p className="flex gap-2 text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0" />
            Pricing will be confirmed by our team. You can still submit your request.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className={accent ? "font-medium text-emerald-600 dark:text-emerald-400" : undefined}>
        {value}
      </span>
    </div>
  );
}