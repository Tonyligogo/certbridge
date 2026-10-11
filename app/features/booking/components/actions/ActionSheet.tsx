"use client";

import type { ReactNode } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { cn } from "@/lib/utils";

interface ActionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  description?: string;

  children: ReactNode;

  className?: string;
}

export function ActionSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: ActionSheetProps) {
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
    >
      <SheetContent
        side="right"
        className={cn(
          "flex w-full flex-col gap-0 p-0 sm:max-w-xl",
          className
        )}
      >
        <SheetHeader className="shrink-0 border-b px-6 py-5 text-left">
          <SheetTitle>
            {title}
          </SheetTitle>

          {description && (
            <SheetDescription>
              {description}
            </SheetDescription>
          )}
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}