"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { CreateQuoteItemInput } from "../types/quote";
import { QuoteItemRow } from "./quoteItemRow";

interface QuoteItemsCardProps {
  items: CreateQuoteItemInput[];
  subtotal: number;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onItemChange: (
    index: number,
    field: keyof CreateQuoteItemInput,
    value: string | number
  ) => void;
}

export function QuoteItemsCard({
  items,
  subtotal,
  onAddItem,
  onRemoveItem,
  onItemChange,
}: QuoteItemsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Quote Line Items</CardTitle>
            <CardDescription className="text-xs">
              Adjust pricing, quantities, or add tailored items discussed with the client.
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={onAddItem}
            className="text-xs gap-1 h-8"
          >
            <Plus className="w-3.5 h-3.5" /> Add Item
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <div className="grid grid-cols-12 gap-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1">
          <div className="col-span-6">Item Description</div>
          <div className="col-span-2 text-center">Qty</div>
          <div className="col-span-2 text-right">Unit Price</div>
          <div className="col-span-2 text-right">Amount</div>
        </div>

        <div className="space-y-2">
          {items.map((item, index) => (
            <QuoteItemRow
              key={index}
              item={item}
              index={index}
              canDelete={items.length > 1}
              onChange={onItemChange}
              onRemove={onRemoveItem}
            />
          ))}
        </div>

        <div className="border-t pt-4 flex justify-between items-center text-sm font-semibold">
          <span className="text-muted-foreground">Total Quoted Amount</span>
          <span className="text-lg font-mono text-primary">
            ${subtotal.toFixed(2)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}