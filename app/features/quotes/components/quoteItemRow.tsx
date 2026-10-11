"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { CreateQuoteItemInput } from "../types/quote";

interface QuoteItemRowProps {
  item: CreateQuoteItemInput;
  index: number;
  canDelete: boolean;
  onChange: (
    index: number,
    field: keyof CreateQuoteItemInput,
    value: string | number
  ) => void;
  onRemove: (index: number) => void;
}

export function QuoteItemRow({
  item,
  index,
  canDelete,
  onChange,
  onRemove,
}: QuoteItemRowProps) {
  const lineAmount = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);

  return (
    <div className="grid grid-cols-12 gap-2 items-center p-2 rounded-lg border bg-card hover:bg-muted/10 transition-colors">
      <div className="col-span-6">
        <Input
          placeholder="Item name / description"
          value={item.name}
          onChange={(e) => onChange(index, "name", e.target.value)}
          className="h-8 text-xs"
        />
      </div>

      <div className="col-span-2">
        <Input
          type="number"
          min="0.01"
          step="any"
          value={item.quantity}
          onChange={(e) =>
            onChange(index, "quantity", parseFloat(e.target.value) || 0)
          }
          className="h-8 text-xs text-center"
        />
      </div>

      <div className="col-span-2">
        <Input
          type="number"
          min="0"
          step="any"
          value={item.unitPrice}
          onChange={(e) =>
            onChange(index, "unitPrice", parseFloat(e.target.value) || 0)
          }
          className="h-8 text-xs text-right"
        />
      </div>

      <div className="col-span-2 flex items-center justify-end gap-1.5 pl-1">
        <span className="font-mono text-xs font-semibold text-foreground">
          ${lineAmount.toFixed(2)}
        </span>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
          onClick={() => onRemove(index)}
          disabled={!canDelete}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}