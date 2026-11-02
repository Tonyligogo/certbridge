import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CopyableFieldProps {
  label: string;
  value?: string | null;
}

export function CopyableField({ label, value }: CopyableFieldProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);

      setCopied(true);
      toast.success(`${label} copied to clipboard`);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      toast.error(`Failed to copy ${label.toLowerCase()}`);
    }
  }

  return (
    <div className="min-w-0 space-y-1">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <div className="flex min-w-0 items-center gap-1.5">
        <p className="min-w-0 break-all text-sm font-medium">
          {value || "—"}
        </p>

        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            aria-label={`Copy ${label.toLowerCase()}`}
            title={`Copy ${label.toLowerCase()}`}
            className="size-7 shrink-0 text-foreground"
          >
            {copied ? (
              <Check className="size-3.5 text-emerald-600" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}