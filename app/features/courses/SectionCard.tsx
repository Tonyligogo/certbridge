import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionCard({
  icon: Icon,
  step,
  title,
  description,
  action,
  children,
  id,
  className,
}: {
  icon: LucideIcon;
  step: string;
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <section id={id} className={cn("panel scroll-mt-28 overflow-hidden", className)}>
      <header className="flex flex-wrap items-start justify-between gap-4 border-b px-6 py-5">
        <div className="flex items-start gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Icon className="size-5" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {step}
            </p>
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {action}
      </header>
      <div className="p-6">{children}</div>
    </section>
  );
}

export function FieldLabel({
  htmlFor,
  children,
  required,
  hint,
}: {
  htmlFor?: string;
  children: ReactNode;
  required?: boolean;
  hint?: ReactNode;
}) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-3">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-foreground"
      >
        {children}
        {required ? <span className="ml-0.5 text-destructive">*</span> : null}
      </label>
      {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
    </div>
  );
}

export function ErrorText({ children }: { children?: string | undefined }) {
  if (!children) return null;
  return <p className="mt-1.5 text-xs font-medium text-destructive">{children}</p>;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-6 py-12 text-center">
      <span className="mb-3 flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Icon className="size-5" />
      </span>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
