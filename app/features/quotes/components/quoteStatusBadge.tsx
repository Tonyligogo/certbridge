"use client";

import { Badge } from "@/components/ui/badge";
import { Clock, Send, CheckCircle2, XCircle } from "lucide-react";
import type { QuoteStatus } from "../types/quote";

export function QuoteStatusBadge({ status }: { status?: QuoteStatus }) {
  switch (status) {
    case "DRAFT":
      return (
        <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-300">
          <Clock className="w-3 h-3 mr-1 text-slate-500" /> Draft
        </Badge>
      );
    case "SENT":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
          <Send className="w-3 h-3 mr-1 text-blue-500" /> Issued / Sent
        </Badge>
      );
    case "ACCEPTED":
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300">
          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> Accepted
        </Badge>
      );
    case "DECLINED":
      return (
        <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-300">
          <XCircle className="w-3 h-3 mr-1 text-rose-600" /> Declined
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300">
          Cancelled
        </Badge>
      );
    case "EXPIRED":
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
          Expired
        </Badge>
      );
    default:
      return <Badge variant="secondary">New Quote</Badge>;
  }
}