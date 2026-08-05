import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

export function ToggleTile({
  icon: Icon,
  label,
  hint,
  checked,
  onCheckedChange,
}: {
  icon: typeof Star;
  label: string;
  hint: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3 rounded-xl border border-border bg-surface p-4 transition-colors",
        checked && "border-primary bg-accent",
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 size-4 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={label} />
    </div>
  );
}