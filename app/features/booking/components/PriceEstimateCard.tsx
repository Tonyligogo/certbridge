import { Info } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatMoney } from "../lib/pricing";

// Extend the PriceEstimate type locally to support optional pricing features safely
interface PriceEstimate{
  participants:number;
  currency:string;
  totalPrice:number;
  pricePerParticipant:number;
}

export function PriceEstimateCard({ estimate }: { estimate: PriceEstimate | null }) {
  if (!estimate) {
    return (
      <p>Please contact our team for pricing information!</p>
    )
  }

  const isAvailable = estimate.totalPrice > 0;
  const total = estimate.totalPrice;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Estimated price</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {isAvailable ? (
          <>
            {total != null && total > 0 && (
              <Row
                label="Training surcharge"
                value={formatMoney(total, estimate.currency)}
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
              This price is exclusive of tax. This will be indicated in you quotation.
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