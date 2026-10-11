import { Building } from "lucide-react";

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-dashed px-4 py-10 text-center">
      <Building className="mx-auto size-8 text-muted-foreground/50" />

      <p className="mt-3 text-sm font-medium">
        {title}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );
}