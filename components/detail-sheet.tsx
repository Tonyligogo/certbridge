"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export interface DetailField {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export interface DetailSection {
  title?: string;
  description?: string;
  fields?: DetailField[];
  customContent?: React.ReactNode;
}

export interface DetailSheetAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  icon?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
}

export interface DetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  statusBadge?: {
    label: string;
    variant?: React.ComponentProps<typeof Badge>["variant"];
    className?: string;
  };
  sections?: DetailSection[];
  children?: React.ReactNode; // For completely custom body content
  actions?: DetailSheetAction[];
  isLoading?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "sm:max-w-md",
  md: "sm:max-w-lg",
  lg: "sm:max-w-xl",
  xl: "sm:max-w-2xl",
};

export function DetailSheet({
  isOpen,
  onClose,
  title,
  subtitle,
  statusBadge,
  sections = [],
  children,
  actions = [],
  isLoading = false,
  size = "lg",
}: DetailSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className={`${sizeClasses[size]} w-full flex flex-col p-0 gap-0`}>
        {/* Header */}
        <SheetHeader className="p-6 pb-4 border-b space-y-1 text-left">
          <div className="flex items-center justify-between gap-3 pr-6">
            <SheetTitle className="text-base font-semibold truncate">
              {title}
            </SheetTitle>
            {statusBadge && (
              <Badge
                variant={statusBadge.variant || "outline"}
                className={`text-[11px] shrink-0 capitalize ${statusBadge.className || ""}`}
              >
                {statusBadge.label}
              </Badge>
            )}
          </div>
          {subtitle && (
            <SheetDescription className="text-xs text-muted-foreground">
              {subtitle}
            </SheetDescription>
          )}
        </SheetHeader>

        {/* Scrollable Body Content */}
        <ScrollArea className="flex-1 p-6">
          {isLoading ? (
            <DetailSheetSkeleton />
          ) : (
            <div className="space-y-6">
              {/* Custom Children Override / Extension */}
              {children}

              {/* Render Structured Sections */}
              {sections.map((section, idx) => (
                <div key={idx} className="space-y-3">
                  {section.title && (
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                        {section.title}
                      </h4>
                      {section.description && (
                        <p className="text-[11px] text-muted-foreground">
                          {section.description}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Render Key-Value Grid */}
                  {section.fields && section.fields.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-muted/20 p-3.5 rounded-lg border">
                      {section.fields.map((field, fIdx) => (
                        <div
                          key={fIdx}
                          className={`space-y-1 ${
                            field.fullWidth ? "sm:col-span-2" : ""
                          }`}
                        >
                          <div className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                            {field.icon && (
                              <span className="text-muted-foreground/70">
                                {field.icon}
                              </span>
                            )}
                            {field.label}
                          </div>
                          <div className="text-xs font-medium text-foreground wrap-break-word">
                            {field.value ?? "—"}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Render Custom Section Node */}
                  {section.customContent && (
                    <div className="pt-1">{section.customContent}</div>
                  )}

                  {idx < sections.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer Actions */}
        {actions.length > 0 && (
          <SheetFooter className="p-4 border-t flex-row items-center justify-end gap-2 sm:space-x-0">
            {actions.map((action, idx) => (
              <Button
                key={idx}
                variant={action.variant || "outline"}
                size="sm"
                onClick={action.onClick}
                disabled={action.disabled || action.isLoading || isLoading}
                className="h-8 text-xs gap-1.5"
              >
                {action.isLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  action.icon
                )}
                {action.label}
              </Button>
            ))}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

// Skeleton Loader Component
function DetailSheetSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <div className="grid grid-cols-2 gap-3 p-3.5 border rounded-lg">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
      <Separator />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <div className="grid grid-cols-2 gap-3 p-3.5 border rounded-lg">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    </div>
  );
}