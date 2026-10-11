"use client";

import type { ReactNode } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  description?: string;

  children: ReactNode;

  onSubmit: () => void | Promise<void>;

  submitLabel?: string;
  loadingLabel?: string;
  cancelLabel?: string;

  isPending?: boolean;
  submitDisabled?: boolean;

  maxWidth?: string;
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  submitLabel = "Save",
  loadingLabel = "Saving...",
  cancelLabel = "Cancel",
  isPending = false,
  submitDisabled = false,
  maxWidth = "sm:max-w-md",
}: FormDialogProps) {
  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isPending || submitDisabled) return;

    await onSubmit();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className={maxWidth}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>

          {description && (
            <DialogDescription>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            {children}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              {cancelLabel}
            </Button>

            <Button
              type="submit"
              disabled={isPending || submitDisabled}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {loadingLabel}
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" />
                  {submitLabel}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}