import { Check, ChevronsUpDown, X, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type Audience = {
  id: string;
  name: string;
  slug: string;
};

export function AudienceMultiSelect({
  value,
  onChange,
  invalid,
  audiences
}: {
  value: string[];
  onChange: (next: string[]) => void;
  invalid?: boolean;
  audiences: Audience[];
}) {
  const [open, setOpen] = useState(false);

  const toggle = (id: string) =>
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between font-normal",
              invalid && "field-error",
              value.length === 0 && "text-muted-foreground",
            )}
          >
            <span className="flex items-center gap-2">
              <Users className="size-4 text-muted-foreground" />
              {value.length ? `${value.length} audience(s) selected` : "Select target audiences"}
            </span>
            <ChevronsUpDown className="size-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search audiences..." />
            <CommandList>
              <CommandEmpty>No audience found.</CommandEmpty>
              <CommandGroup>
                {audiences.map((audience) => (
                  <CommandItem
                    key={audience.id}
                    value={audience.name}
                    onSelect={() => toggle(audience.id)}
                  >
                    <Check
                      className={cn(
                        "size-4",
                        value.includes(audience.id) ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {audience.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {value.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {value.map((id) => {
            const audience = audiences.find((a) => a.id === id);
            if (!audience) return null;
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1.5 rounded-full bg-accent py-1 pl-3 pr-1.5 text-xs font-medium text-accent-foreground"
              >
                {audience.name}
                <button
                  type="button"
                  aria-label={`Remove ${audience.name}`}
                  onClick={() => toggle(id)}
                  className="flex size-4 items-center justify-center rounded-full transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <X className="size-3" />
                </button>
              </span>
            );
          })}
        </div>
      ) : (
        <p className="mt-2 text-xs text-muted-foreground">
          No audiences linked yet — selected audiences appear here as removable tags.
        </p>
      )}
    </div>
  );
}
