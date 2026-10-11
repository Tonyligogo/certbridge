"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UpdateVenueInput, Venue } from "../types/venue";
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
import { Loader2, Save, X } from "lucide-react";
import { useUpdateVenue } from "../hooks/use-venues";
import { updateVenueSchema } from "../lib/venue-schema";

interface VenueEditFormTabProps {
  venue: Venue;
  onSuccess: () => void;
  onCancel: () => void;
}

export function VenueEditFormTab({ venue, onSuccess, onCancel }: VenueEditFormTabProps) {
  const updateMutation = useUpdateVenue();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateVenueInput>({
    resolver: zodResolver(updateVenueSchema),
    defaultValues: {
      name: venue.name || "",
      description: venue.description || "",
      country: venue.country || "",
      city: venue.city || "",
      address: venue.address || "",
      phone: venue.phone || "",
      email: venue.email || "",
      website: venue.website || "",
      capacity: venue.capacity ?? undefined,
      notes: venue.notes || "",
      status: venue.status,
    },
  });

  const onSubmit = (data: UpdateVenueInput) => {
    updateMutation.mutate(
      { id: venue.id, data },
      {
        onSuccess: () => {
          onSuccess();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 text-xs">
      <div className="space-y-1.5">
        <Label className="text-xs">Venue Name *</Label>
        <Input {...register("name")} placeholder="e.g. Sarova Stanley" className="h-8 text-xs" />
        {errors.name && <p className="text-[11px] text-destructive">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">City *</Label>
          <Input {...register("city")} placeholder="e.g. Nairobi" className="h-8 text-xs" />
          {errors.city && <p className="text-[11px] text-destructive">{errors.city.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Country *</Label>
          <Input {...register("country")} placeholder="e.g. Kenya" className="h-8 text-xs" />
          {errors.country && <p className="text-[11px] text-destructive">{errors.country.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Capacity (Seats)</Label>
          <Input
            type="number"
            {...register("capacity", { valueAsNumber: true })}
            placeholder="e.g. 100"
            className="h-8 text-xs"
          />
          {errors.capacity && (
            <p className="text-[11px] text-destructive">{errors.capacity.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Status</Label>
          <Select
            value={watch("status")}
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

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Phone Number</Label>
          <Input {...register("phone")} placeholder="+254 700 000000" className="h-8 text-xs" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Email Address</Label>
          <Input {...register("email")} placeholder="events@hotel.com" className="h-8 text-xs" />
          {errors.email && <p className="text-[11px] text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Physical Address</Label>
        <Input {...register("address")} placeholder="Kimathi Street, Central District" className="h-8 text-xs" />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Website URL</Label>
        <Input {...register("website")} placeholder="https://..." className="h-8 text-xs" />
        {errors.website && <p className="text-[11px] text-destructive">{errors.website.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Description</Label>
        <Textarea
          {...register("description")}
          rows={3}
          placeholder="Brief overview of amenities and capabilities..."
          className="text-xs resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Internal Notes</Label>
        <Textarea
          {...register("notes")}
          rows={2}
          placeholder="Private operational notes..."
          className="text-xs resize-none"
        />
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center gap-2 pt-2">
        <Button
          type="submit"
          size="sm"
          className="h-8 text-xs gap-1.5 flex-1"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          Save Changes
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 text-xs gap-1"
          onClick={onCancel}
          disabled={updateMutation.isPending}
        >
          <X className="h-3.5 w-3.5" /> Cancel
        </Button>
      </div>
    </form>
  );
}