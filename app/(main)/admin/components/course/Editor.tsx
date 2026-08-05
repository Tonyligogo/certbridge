import { Bold, Heading2, Italic, List, ListOrdered, Quote } from "lucide-react";
import { useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Tool = { icon: typeof Bold; label: string; wrap?: [string, string]; prefix?: string };

const TOOLS: Tool[] = [
  { icon: Bold, label: "Bold", wrap: ["**", "**"] },
  { icon: Italic, label: "Italic", wrap: ["_", "_"] },
  { icon: Heading2, label: "Heading", prefix: "## " },
  { icon: List, label: "Bullet list", prefix: "- " },
  { icon: ListOrdered, label: "Numbered list", prefix: "1. " },
  { icon: Quote, label: "Quote", prefix: "> " },
];

export function RichTextEditor({
  value,
  onChange,
  invalid,
  id,
}: {
  value: string;
  onChange: (next: string) => void;
  invalid?: boolean;
  id?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const apply = (tool: Tool) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);
    let next: string;
    if (tool.wrap) {
      next = `${value.slice(0, start)}${tool.wrap[0]}${selected || "text"}${tool.wrap[1]}${value.slice(end)}`;
    } else {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      next = `${value.slice(0, lineStart)}${tool.prefix}${value.slice(lineStart)}`;
    }
    onChange(next);
    requestAnimationFrame(() => el.focus());
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border",
        invalid && "field-error",
      )}
    >
      <Textarea
        id={id}
        ref={ref}
        rows={10}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Give a full overview of the course"
        className="resize-y border-0"
      />
    </div>
  );
}
