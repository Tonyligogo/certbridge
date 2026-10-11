import { Loader2 } from "lucide-react";

export function LoadingState({
  text,
}: {
  text: string;
}) {
  return (
    <div className="space-y-2 py-12 text-center text-xs text-muted-foreground">
      <Loader2 className="mx-auto size-6 animate-spin text-primary" />
      <p>{text}</p>
    </div>
  );
}