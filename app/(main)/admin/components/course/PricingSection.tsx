import { FieldLabel } from "./SectionCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DELIVERY_MODES,
  DELIVERY_MODE_LABELS,
  type DeliveryMode,
  type PricingTier,
} from "./schema";

export function PricingSection({
  pricing,
  onChange,
}: {
  pricing: PricingTier;
  onChange: (patch: Partial<PricingTier>) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div>
        <FieldLabel>Delivery Mode</FieldLabel>

        <Select
          value={pricing.deliveryMode}
          onValueChange={(value) =>
            onChange({
              deliveryMode: value as DeliveryMode,
            })
          }
        >
          <SelectTrigger className="bg-card">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {DELIVERY_MODES.map((mode) => (
              <SelectItem key={mode} value={mode}>
                {DELIVERY_MODE_LABELS[mode]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <FieldLabel>Currency</FieldLabel>

        <Input
          className="bg-card uppercase"
          value={pricing.currency}
          maxLength={3}
          onChange={(e) =>
            onChange({
              currency: e.target.value.toUpperCase(),
            })
          }
        />
      </div>

      <div>
        <FieldLabel>Amount</FieldLabel>

        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
            {pricing.currency || "KES"}
          </span>

          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            className="bg-card pl-12"
            value={pricing.amount}
            onChange={(e) =>
              onChange({
                amount: e.target.value,
              })
            }
            onBlur={(e) =>
              onChange({
                amount: e.target.value
                  ? Number(e.target.value).toFixed(2)
                  : "",
              })
            }
          />
        </div>
      </div>
    </div>
  );
}