"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import type { Quote } from "../types/quote";

interface QuoteSidebarProps {
  quote?: Quote | null;
  subtotal: number;
  expiresAt: Date | null;
  onExpiresAtChange: (date: Date | null) => void;
}

export function QuoteSidebar({
  quote,
  subtotal,
  expiresAt,
  onExpiresAtChange,
}: QuoteSidebarProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-sm font-semibold">Quote Settings & Dates</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-medium text-foreground">Expiration Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal h-8 text-xs"
                >
                  <CalendarIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                  {expiresAt ? (
                    format(expiresAt, "PPP")
                  ) : (
                    <span className="text-muted-foreground">Set expiration date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={expiresAt || undefined}
                  onSelect={(date) => onExpiresAtChange(date || null)}
                //   initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {quote && (
            <div className="pt-3 border-t space-y-2 text-[11px] text-muted-foreground">
              <div className="flex justify-between">
                <span>Issued At:</span>
                <span className="font-medium text-foreground">
                  {quote.issuedAt ? format(new Date(quote.issuedAt), "PPP p") : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Accepted At:</span>
                <span className="font-medium text-foreground">
                  {quote.acceptedAt ? format(new Date(quote.acceptedAt), "PPP p") : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Declined At:</span>
                <span className="font-medium text-foreground">
                  {quote.declinedAt ? format(new Date(quote.declinedAt), "PPP p") : "—"}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2 font-medium text-primary text-xs">
            <DollarSign className="w-4 h-4" />
            Quick Quote Summary
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Updating and marking quotes as accepted automatically keeps your booking pipeline accurate.
          </p>
          <div className="text-xl font-bold font-mono text-foreground">
            ${subtotal.toFixed(2)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}