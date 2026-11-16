"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { QuotationPriceEstimator } from "./QuotationPriceEstimator";
import {
  useCreateEnquiryQuotation,
  useUpdateEnquiryQuotation,
  useUpdateIssueEnquiryQuotation,
} from "../../hooks/use-enquiry-quotations";
import type { AdminEnquiryDetail, EnquiryQuote } from "../../types";

type TaxType = "STANDARD" | "ZERO_RATED" | "EXEMPT" | "NONE";
type Item = { key: number; name: string; unitPrice: string };
const currency = (amount: number, code: string) =>
  `${code} ${new Intl.NumberFormat("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)}`;
const validMoney = (value: string) => /^\d+(?:\.\d{1,2})?$/.test(value);
const toDateInput = (value?: string | null) => value ? value.slice(0, 10) : "";
const toMoneyInput = (value: string) => Number(value).toFixed(2);

interface Props {
  enquiry: AdminEnquiryDetail;
  /** Supply the selected quote from the list query for edit mode. */
  quote?: EnquiryQuote;
  onCancel: () => void;
  onSuccess: (quoteId?: string) => void;
}

export function EnquiryQuotationEditor({ enquiry, quote, onCancel, onSuccess }: Props) {
  const [items, setItems] = useState<Item[]>(() =>
    quote?.items?.length
      ? quote.items.map((item, index) => ({ key: index, name: item.name, unitPrice: toMoneyInput(item.unitPrice) }))
      : [{ key: 0, name: enquiry.courseName || enquiry.course?.title || "", unitPrice: "" }],
  );
  const [nextKey, setNextKey] = useState(() => quote?.items?.length ?? 1);
  const [taxType, setTaxType] = useState<TaxType>((quote?.taxType as TaxType) ?? "STANDARD");
  const [expiresAt, setExpiresAt] = useState(toDateInput(quote?.expiresAt));
  const [responseNotes, setResponseNotes] = useState(quote?.responseNotes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  const create = useCreateEnquiryQuotation(enquiry.id);
  const update = useUpdateEnquiryQuotation(enquiry.id);
  const updateIssue = useUpdateIssueEnquiryQuotation(enquiry.id);
  const busy = create.isPending || update.isPending || updateIssue.isPending;
  const isEditing = Boolean(quote);
  const currencyCode = quote?.currency ?? "KES";

  const subtotalCents = useMemo(() => items.reduce((sum, item) => {
    const value = Number(item.unitPrice);
    return sum + (Number.isFinite(value) && value >= 0 ? Math.round(value * 100) : 0);
  }, 0), [items]);
  // Preview only: server-side tax calculation remains authoritative.
  const taxCents = taxType === "STANDARD" ? Math.round(subtotalCents * 0.16) : 0;
  const subtotal = subtotalCents / 100;
  const tax = taxCents / 100;
  const total = (subtotalCents + taxCents) / 100;

  const changeItem = (key: number, field: "name" | "unitPrice", value: string) => {
    setItems(current => current.map(item => item.key === key ? { ...item, [field]: value } : item));
    setDirty(true);
    setError(null);
  };

  const validate = (issuing: boolean) => {
    if (items.length === 0 || items.some(item => !item.name.trim() || item.name.trim().length > 500 || !validMoney(item.unitPrice))) {
      return "Every line item needs a description and a valid non-negative price (up to two decimal places).";
    }
    if (issuing && !expiresAt) return "Set an expiry date before issuing this quotation.";
    if (expiresAt && !/^\d{4}-\d{2}-\d{2}$/.test(expiresAt)) return "Enter a valid expiry date.";
    if (issuing && subtotalCents <= 0) return "A quotation must have a positive total before issuance.";
    return null;
  };

  const submit = async (issuing: boolean) => {
    if (busy) return;
    const validationError = validate(issuing);
    if (validationError) { setError(validationError); return; }

    const payload = {
      taxType,
      items: items.map(({ name, unitPrice }) => ({
        name: name.trim(),
        quantity: "1",
        unitPrice: Number(unitPrice).toFixed(2),
      })),
      expiresAt: expiresAt ? new Date(`${expiresAt}T12:00:00+03:00`) : undefined,
      responseNotes: responseNotes.trim() || null,
    };

    try {
      setError(null);
      if (!quote) {
        const result = await create.mutateAsync({ ...payload, status: issuing ? "ISSUED" : "DRAFT" });
        if (result?.issuance.requested && !result.issuance.success) {
          toast.warning("Draft saved, but issuance failed", { description: result.issuance.message ?? undefined });
        } else {
          toast.success(issuing ? "Quotation issued" : "Draft quotation saved");
        }
        setDirty(false);
        onSuccess(result?.quote.id);
        return;
      }
      setDirty(false);
      if (issuing) {
        try {
          await updateIssue.mutateAsync({ quoteId: quote.id, input: payload });
        } catch{
          toast.warning("Changes saved, but issuance failed");
        }
      } else {
        await update.mutateAsync({ quoteId: quote.id, input: payload });
      }
      onSuccess(quote.id);
    } catch{
      setError( "Unable to save quotation. Please try again.");
    }
  };

  const requestCancel = () => {
    if (dirty && !window.confirm("Discard your unsaved quotation changes?")) return;
    onCancel();
  };

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1 space-y-6 px-5 py-6">
        <div className="flex items-center gap-3">
          <Button type="button" size="icon" variant="ghost" onClick={requestCancel} disabled={busy} aria-label="Back to quotations"><ArrowLeft className="size-4" /></Button>
          <div className="min-w-0">
            <h3 className="text-base font-semibold">{isEditing ? "Edit draft quotation" : "Create quotation"}</h3>
            <p className="text-xs text-muted-foreground">{enquiry.reference}{quote ? ` · ${quote.reference}` : ""}</p>
          </div>
        </div>

        <QuotationPriceEstimator
          enquiry={enquiry}
          quotationCurrency={currencyCode}
          disabled={busy}
          initiallyExpanded={!quote}
          onApply={({ name, unitPrice }) => {
            setItems(current => current.map((item, index) => index === 0 ? { ...item, name, unitPrice } : item));
            setDirty(true);
            setError(null);
          }}
        />

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div><h4 className="text-sm font-semibold">Line items</h4><p className="text-xs text-muted-foreground">Enter a description and price for each item.</p></div>
            <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => { setItems(current => [...current, { key: nextKey, name: "", unitPrice: "" }]); setNextKey(key => key + 1); setDirty(true); }}><Plus className="size-4" /> Add item</Button>
          </div>
          {items.map((item, index) => (
            <div key={item.key} className="space-y-3 rounded-xl border bg-card p-4">
              <div className="flex items-center justify-between"><span className="text-xs font-semibold text-muted-foreground">ITEM {index + 1}</span><Button type="button" variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive" disabled={busy || items.length === 1} aria-label={`Remove item ${index + 1}`} onClick={() => { setItems(current => current.filter(i => i.key !== item.key)); setDirty(true); }}><Trash2 className="size-4" /></Button></div>
              <div className="space-y-1.5"><Label htmlFor={`name-${item.key}`}>Description</Label><Input id={`name-${item.key}`} value={item.name} maxLength={500} placeholder="e.g. Project management training" disabled={busy} onChange={event => changeItem(item.key, "name", event.target.value)} /></div>
              <div className="space-y-1.5"><Label htmlFor={`price-${item.key}`}>Price ({currencyCode})</Label><Input id={`price-${item.key}`} value={item.unitPrice} inputMode="decimal" placeholder="0.00" disabled={busy} onChange={event => changeItem(item.key, "unitPrice", event.target.value)} /></div>
            </div>
          ))}
        </section>

        <Separator />
        <section className="space-y-4">
          <h4 className="text-sm font-semibold">Quotation settings</h4>
          <div className="space-y-1.5"><Label>Tax treatment</Label><Select value={taxType} disabled={busy} onValueChange={value => { setTaxType(value as TaxType); setDirty(true); }}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="STANDARD">Standard VAT (16%)</SelectItem><SelectItem value="ZERO_RATED">Zero-rated</SelectItem><SelectItem value="EXEMPT">Exempt</SelectItem><SelectItem value="NONE">No tax</SelectItem></SelectContent></Select></div>
          <div className="space-y-1.5"><Label htmlFor="quote-expiry">Expiry date</Label><Input id="quote-expiry" type="date" value={expiresAt} disabled={busy} onChange={event => { setExpiresAt(event.target.value); setDirty(true); }} /><p className="text-xs text-muted-foreground">Required before issuing.</p></div>
          <div className="space-y-1.5"><Label htmlFor="quote-notes">Notes (optional)</Label><Textarea id="quote-notes" value={responseNotes} disabled={busy} rows={3} placeholder="Additional information for this quotation" onChange={event => { setResponseNotes(event.target.value); setDirty(true); }} /></div>
        </section>

        <section className="space-y-3 rounded-xl bg-muted/40 p-4" aria-label="Estimated quotation total">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="tabular-nums">{currency(subtotal, currencyCode)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">{taxType === "STANDARD" ? "Estimated VAT (16%)" : "Tax"}</span><span className="tabular-nums">{currency(tax, currencyCode)}</span></div>
          <Separator />
          <div className="flex justify-between gap-2"><span className="text-sm font-semibold">Estimated total</span><span className="text-lg font-semibold tabular-nums">{currency(total, currencyCode)}</span></div>
          <p className="text-xs text-muted-foreground">Final totals are calculated by the server.</p>
        </section>
        {error && <div role="alert" className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"><AlertTriangle className="mt-0.5 size-4 shrink-0" />{error}</div>}
      </div>
      <div className="sticky bottom-0 z-10 flex gap-2 border-t bg-background/95 px-5 py-4 backdrop-blur">
        <Button type="button" variant="outline" className="flex-1" disabled={busy} onClick={() => void submit(false)}>{busy ? <Loader2 className="size-4 animate-spin" /> : null}{isEditing ? "Save changes" : "Save draft"}</Button>
        <Button type="button" className="flex-1" disabled={busy} onClick={() => void submit(true)}>{busy ? <Loader2 className="size-4 animate-spin" /> : null}{isEditing ? "Save & issue" : "Issue quotation"}</Button>
      </div>
    </div>
  );
}
