import type {
  LucideIcon,
} from "lucide-react";

interface DetailItemProps {
  icon?: LucideIcon;
  label: string;
  value?: React.ReactNode;
  children?: React.ReactNode;
}

export function DetailItem({
  icon: Icon,
  label,
  value,
  children,
}: DetailItemProps) {
  return (
    <div className="flex min-w-0 gap-3">
      {Icon && (
        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
          <Icon className="size-4 text-muted-foreground" />
        </div>
      )}

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">
          {label}
        </p>

        {children ?? (
          <p className="mt-0.5 wrap-break-word text-sm font-medium">
            {value || "—"}
          </p>
        )}
      </div>
    </div>
  );
}