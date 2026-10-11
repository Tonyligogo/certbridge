"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateVenueSheet } from "./create-venue-sheet";

export function VenueHeaderActions() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <>
      <Button
        size="sm"
        className="h-9 text-xs gap-1.5 shrink-0"
        onClick={() => setIsCreateOpen(true)}
      >
        <Plus className="h-4 w-4" /> Add New Venue
      </Button>

      <CreateVenueSheet
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </>
  );
}