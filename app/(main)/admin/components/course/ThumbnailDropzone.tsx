import { ImagePlus, Trash2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function ThumbnailDropzone({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    onChange(URL.createObjectURL(file));
  };

  return (
    <div className="space-y-3">
      {value ? (
        <div className="group relative overflow-hidden rounded-xl border border-border">
          <img
            src={value}
            alt="Course thumbnail preview"
            className="h-44 w-full object-cover"
          />
          <div className="flex items-center justify-between gap-3 border-t border-border bg-surface px-3 py-2">
            <span className="truncate text-xs text-muted-foreground">{value}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange("")}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="size-4" /> Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-6 py-10 text-center transition-colors",
            dragging && "border-primary bg-accent",
          )}
        >
          <span className="mb-3 flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
            {dragging ? <ImagePlus className="size-5" /> : <UploadCloud className="size-5" />}
          </span>
          <p className="text-sm font-semibold text-foreground">
            Drop thumbnail here or click to upload
          </p>
          <p className="mt-1 text-xs text-muted-foreground">PNG or JPG · 1280×720 recommended</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Thumbnail URL — https://cdn.certbridge.global/courses/..."
      />
    </div>
  );
}
