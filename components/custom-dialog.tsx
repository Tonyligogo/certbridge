import React from 'react';
import {
Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";

interface CustomDialogProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const CustomDialog: React.FC<CustomDialogProps> = ({
  isOpen,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  className,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      
      <DialogContent className={`max-h-[85vh] ${className} overflow-auto`}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-slate-500">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Modal Main Body Content */}
        <div className="py-4 max-h-[85vh] overflow-auto">
          {children}
        </div>

        {/* Optional Footer Operations */}
        {footer && (
          <DialogFooter>
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};