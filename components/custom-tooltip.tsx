import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CustomTooltipProps {
  text: string;
  maxWidthClass?: string;
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
}

export function CustomTooltip({
  text,
  maxWidthClass = "max-w-[200px]",
  className,
  side = "top",
}: CustomTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            "block truncate cursor-default",
            maxWidthClass,
            className
          )}
        >
          {text}
        </span>
      </TooltipTrigger>
      <TooltipContent side={side} className="max-w-xs wrap-break-word">
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  );
}