"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateVenueInput } from "../types/venue";
import { useCreateVenue } from "../hooks/use-venues";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Building2 } from "lucide-react";
import { createVenueSchema } from "../lib/venue-schema";
import { useRouter } from "next/navigation";

interface CreateVenueSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateVenueSheet({ isOpen, onClose }: CreateVenueSheetProps) {
  const createMutation = useCreateVenue();
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateVenueInput>({
    resolver: zodResolver(createVenueSchema),
    defaultValues: {
      name: "",
      description: "",
      country: "",
      city: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      capacity: null,
      notes: "",
      status: "ACTIVE",
    },
  });

  const onSubmit = (data: CreateVenueInput) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.refresh();
        reset();
        onClose();
      },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent className="w-full sm:max-w-xl flex flex-col h-full p-0 gap-0">
        {/* Header */}
        <SheetHeader className="p-6 border-b bg-muted/20 shrink-0">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs">
            <Building2 className="h-4 w-4" /> New Directory Record
          </div>
          <SheetTitle className="text-xl font-bold">Add New Venue</SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Register a partner venue to make it available for training assignments.
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto">
          <form id="create-venue-form" onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 text-xs">
            {/* Venue Name */}
            <div className="space-y-1.5">
              <Label className="text-xs">Venue Name *</Label>
              <Input
                {...register("name")}
                placeholder="e.g. Radisson Blu Hotel"
                className="h-8 text-xs"
              />
              {errors.name && (
                <p className="text-[11px] text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* City & Country */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">City *</Label>
                <Input
                  {...register("city")}
                  placeholder="e.g. Nairobi"
                  className="h-8 text-xs"
                />
                {errors.city && (
                  <p className="text-[11px] text-destructive">{errors.city.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Country *</Label>
                <Input
                  {...register("country")}
                  placeholder="e.g. Kenya"
                  className="h-8 text-xs"
                />
                {errors.country && (
                  <p className="text-[11px] text-destructive">{errors.country.message}</p>
                )}
              </div>
            </div>

            {/* Capacity & Status */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Capacity (Seats)</Label>
                <Input
                  type="number"
                  {...register("capacity", {
                    setValueAs: (v) => (v === "" || isNaN(v) ? null : Number(v)),
                  })}
                  placeholder="e.g. 150"
                  className="h-8 text-xs"
                />
                {errors.capacity && (
                  <p className="text-[11px] text-destructive">{errors.capacity.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Status</Label>
                <Select
                  value={watch("status") || "ACTIVE"}
                  onValueChange={(val) => setValue("status", val as "ACTIVE" | "INACTIVE")}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE" className="text-xs">
                      Active
                    </SelectItem>
                    <SelectItem value="INACTIVE" className="text-xs">
                      Inactive
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Phone Number</Label>
                <Input
                  {...register("phone")}
                  placeholder="+254 700 000000"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Email Address</Label>
                <Input
                  {...register("email")}
                  placeholder="events@venue.com"
                  className="h-8 text-xs"
                />
                {errors.email && (
                  <p className="text-[11px] text-destructive">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <Label className="text-xs">Physical Address</Label>
              <Input
                {...register("address")}
                placeholder="Upper Hill Road, Nairobi"
                className="h-8 text-xs"
              />
            </div>

            {/* Website */}
            <div className="space-y-1.5">
              <Label className="text-xs">Website URL</Label>
              <Input
                {...register("website")}
                placeholder="https://..."
                className="h-8 text-xs"
              />
              {errors.website && (
                <p className="text-[11px] text-destructive">{errors.website.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <Textarea
                {...register("description")}
                rows={3}
                placeholder="Amenities, seating configuration options, breakout room details..."
                className="text-xs resize-none"
              />
            </div>

            {/* Internal Notes */}
            <div className="space-y-1.5">
              <Label className="text-xs">Internal Admin Notes</Label>
              <Textarea
                {...register("notes")}
                rows={2}
                placeholder="Pricing negotiations, contact person details..."
                className="text-xs resize-none"
              />
            </div>
          </form>
        </div>

        {/* Footer Controls */}
        <div className="p-4 border-t bg-background flex items-center justify-end gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={handleClose}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-venue-form"
            size="sm"
            className="h-8 text-xs gap-1.5"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            Create Venue
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}