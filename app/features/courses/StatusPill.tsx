import { cn } from "@/lib/utils";
import { CourseStatus } from "./schema";

export function StatusPill({ status }: { status: CourseStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide",
        status === "PUBLISHED" && "border-success/40 bg-success/10 text-success",
        status === "DRAFT" && "border-border bg-surface text-muted-foreground",
        status === "ARCHIVED" && "border-border bg-muted text-muted-foreground",
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}