
import { cn } from "@/lib/utils";

interface LegalSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function LegalSection({
  id,
  title,
  children,
  className,
}: LegalSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn(
        "mb-10 scroll-mt-28 border-b border-border/70 pb-10 last:mb-0 last:border-0 last:pb-0",
        className
      )}
    >
      <h2
        id={`${id}-heading`}
        className="mb-5 text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
      >
        {title}
      </h2>

      <div className="space-y-5 text-[14px] leading-7 text-muted-foreground sm:text-[15px]">
        {children}
      </div>
    </section>
  );
}
