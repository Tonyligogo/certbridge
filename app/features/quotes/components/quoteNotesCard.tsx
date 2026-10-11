"use client";

import { PhoneCall } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface QuoteNotesCardProps {
  responseNotes: string;
  onNotesChange: (value: string) => void;
}

export function QuoteNotesCard({
  responseNotes,
  onNotesChange,
}: QuoteNotesCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-primary" />
          Call Notes & Client Feedback
        </CardTitle>
        <CardDescription className="text-xs">
          Log key agreements, custom discounts, or client objections discussed during phone calls.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="e.g. Client agreed to $1,500 course fee provided we include venue setup..."
          value={responseNotes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={4}
          className="text-xs resize-none"
        />
      </CardContent>
    </Card>
  );
}