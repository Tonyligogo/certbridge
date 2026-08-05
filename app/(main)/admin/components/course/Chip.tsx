import { Star } from "lucide-react";

export function Chip({ icon: Icon, children }: { icon: typeof Star; children: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium text-accent-foreground">
      <Icon className="size-3" /> {children}
    </span>
  );
}