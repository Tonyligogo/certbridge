"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Trash2 } from "lucide-react";

import { useDeleteVenue, useUpdateVenue } from "../hooks/use-venues";
import { VenueOverviewTab } from "./venue-overview-tab";
import { VenueEditFormTab } from "./venue-edit-form-tab";
import { VenueBookingsTab } from "./venue-bookings-tab";
import { Venue } from "../types/venue";
import { ConfirmDialog } from "@/components/confirm-dialog";

interface VenueSheetProps {
  venue: Venue;
  isOpen: boolean;
  onClose: () => void;
}

export function VenueSheet({ venue, isOpen, onClose }: VenueSheetProps) {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [removeVenue, setRemoveVenue] = useState<boolean>(false);
  const deleteMutation = useDeleteVenue();
  const updateMutation = useUpdateVenue();

  const handleToggleStatus = () => {
    if (!venue) return;
    const nextStatus = venue.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    updateMutation.mutate({ id: venue.id, data: { status: nextStatus } });
  };

  const handleDelete = () => {
    if (!venue) return;
    deleteMutation.mutate(venue.id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-xl flex flex-col h-full p-0 gap-0">
          <>
            {/* Sheet Header */}
            <SheetHeader className="p-6 border-b bg-muted/20 shrink-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <Badge
                  variant={venue.status === "ACTIVE" ? "default" : "secondary"}
                  className="text-[10px]"
                >
                  {venue.status}
                </Badge>
              </div>

              <SheetTitle className="text-xl font-bold line-clamp-1">
                {venue.name}
              </SheetTitle>

              <SheetDescription className="text-xs text-muted-foreground flex items-center gap-1.5 pt-0.5">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                {venue.city}, {venue.country}
              </SheetDescription>
            </SheetHeader>

            {/* Scrollable Main Body */}
            <div className="flex-1 overflow-y-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="px-6 py-2 border-b sticky top-0 z-10 bg-background">
                  <TabsList className="grid grid-cols-3 bg-muted/60 h-8">
                    <TabsTrigger value="overview" className="text-xs">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="edit" className="text-xs">
                      Edit
                    </TabsTrigger>
                    <TabsTrigger value="bookings" className="text-xs">
                      Bookings ({venue._count?.bookings})
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="overview" className="m-0">
                  <VenueOverviewTab
                    venue={venue}
                    onEditClick={() => setActiveTab("edit")}
                  />
                </TabsContent>

                <TabsContent value="edit" className="m-0">
                  <VenueEditFormTab
                    venue={venue}
                    onSuccess={() => setActiveTab("overview")}
                    onCancel={() => setActiveTab("overview")}
                  />
                </TabsContent>

                <TabsContent value="bookings" className="m-0">
                  <VenueBookingsTab venueId={venue.id} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Sheet Footer Bar */}
            <div className="p-4 border-t bg-background flex items-center justify-between gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={handleToggleStatus}
                disabled={updateMutation.isPending}
              >
                {venue.status === "ACTIVE" ? "Deactivate" : "Activate"}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={()=>setRemoveVenue(true)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove Venue
              </Button>
              <ConfirmDialog
                open={removeVenue}
                onOpenChange={()=>setRemoveVenue(false)}
                onConfirm = {()=>handleDelete()}
                title = {`Are you sure you want to remove ${venue.name}?`}
                description = {` This action permanently removes ${venue.name} from the records. This action cannot be undone. `}
                isLoading = {deleteMutation.isPending}
                variant = "destructive"
                action = "Remove Venue"
              />
            </div>
          </>
      </SheetContent>
    </Sheet>
  );
}