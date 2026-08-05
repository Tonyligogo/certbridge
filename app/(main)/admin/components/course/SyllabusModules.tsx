import { ArrowDown, ArrowUp, GripVertical, LayoutList, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState, FieldLabel } from "./SectionCard";
import { cn } from "@/lib/utils";
import { CourseForm } from "../../courses/[id]/page";

export function SyllabusModules({
  modules,
  onPatch,
  onRemove,
  onReorder,
  onAdd,
}: {
  modules: CourseForm["modules"];
  onPatch: (id: string, patch: Partial<CourseForm["modules"][number]>) => void;
  onRemove: (id: string) => void;
  onReorder: (from: number, to: number) => void;
  onAdd: () => void;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  if (modules.length === 0) {
    return (
      <EmptyState
        icon={LayoutList}
        title="Your syllabus is empty"
        description="Build the course outline module by module. Drag cards to reorder them once added."
        action={
          <Button type="button" variant="outline" onClick={onAdd}>
            <Plus className="size-4" /> Add Module
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      {modules.map((module, index) => (
        <div
          key={module.id}
          draggable
          onDragStart={() => setDragIndex(index)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (dragIndex !== null && dragIndex !== index) onReorder(dragIndex, index);
            setDragIndex(null);
          }}
          onDragEnd={() => setDragIndex(null)}
          className={cn(
            "rounded-xl border border-border bg-surface p-4 transition-shadow",
            dragIndex === index && "opacity-60 ring-2 ring-ring",
          )}
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="cursor-grab text-muted-foreground active:cursor-grabbing">
                <GripVertical className="size-4" />
              </span>
              <span className="flex size-6 items-center justify-center rounded-md bg-accent text-xs font-semibold text-accent-foreground">
                {index + 1}
              </span>
              <span className="text-sm font-semibold text-foreground">
                {module.title || "Untitled module"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Move module up"
                disabled={index === 0}
                onClick={() => onReorder(index, index - 1)}
              >
                <ArrowUp className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Move module down"
                disabled={index === modules.length - 1}
                onClick={() => onReorder(index, index + 1)}
              >
                <ArrowDown className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Delete module"
                onClick={() => onRemove(module.title)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
            <div>
              <FieldLabel htmlFor={`mod-title-${module.id}`}>Module title</FieldLabel>
              <Input
                id={`mod-title-${module.id}`}
                className="bg-card"
                placeholder="e.g. Risk Identification Frameworks"
                value={module.title}
                onChange={(e) => onPatch(module.id, { title: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel htmlFor={`mod-dur-${module.id}`}>Estimated duration (min)</FieldLabel>
              <Input
                id={`mod-dur-${module.id}`}
                type="number"
                min="0"
                className="bg-card tabular-nums"
                placeholder="45"
                value={module.estimatedDuration}
                onChange={(e) => onPatch(module.id, { estimatedDuration: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="mt-3">
            <FieldLabel htmlFor={`mod-desc-${module.id}`}>Module description</FieldLabel>
            <Textarea
              id={`mod-desc-${module.id}`}
              rows={3}
              className="bg-card"
              placeholder="What learners will cover and achieve in this module."
              value={module.description}
              onChange={(e) => onPatch(module.id, { description: e.target.value })}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
