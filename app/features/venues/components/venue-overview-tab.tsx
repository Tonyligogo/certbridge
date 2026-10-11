"use client";

import type { Venue } from "../types/venue";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  FileText,
  ExternalLink,
  Edit,
} from "lucide-react";

interface VenueOverviewTabProps {
  venue: Venue;
  onEditClick: () => void;
}

export function VenueOverviewTab({ venue, onEditClick }: VenueOverviewTabProps) {

  return (
    <div className="p-6 space-y-6">
      {/* Quick Metrics Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-xl border bg-card space-y-1">
          <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-primary" /> Seating Capacity
          </span>
          <p className="text-base font-bold text-foreground">
            {venue.capacity ? `${venue.capacity} Attendees` : "Unspecified"}
          </p>
        </div>
      </div>

      {/* Description */}
      {venue.description && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            About Venue
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed bg-muted/20 p-3.5 rounded-xl border">
            {venue.description}
          </p>
        </div>
      )}

      {/* Location & Address */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> Location & Address
          </h4>
        </div>
        <div className="p-3.5 rounded-xl border bg-card space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">City & Country</span>
            <span className="font-semibold text-foreground">
              {venue.city}, {venue.country}
            </span>
          </div>
          {venue.address && (
            <>
              <Separator />
              <div>
                <span className="text-muted-foreground block mb-0.5">Physical Address</span>
                <span className="font-medium text-foreground">{venue.address}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Primary Contact Details */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Building2 className="h-3.5 w-3.5" /> Contact Details
        </h4>
        <div className="p-3.5 rounded-xl border bg-card space-y-2.5 text-xs">
          {venue.email ? (
            <a
              href={`mailto:${venue.email}`}
              className="flex items-center justify-between text-muted-foreground hover:text-primary transition-colors"
            >
              <span className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary" /> Email Address
              </span>
              <span className="font-medium truncate max-w-50">{venue.email}</span>
            </a>
          ) : (
            <div className="flex justify-between text-muted-foreground">
              <span>Email</span>
              <span>Not Provided</span>
            </div>
          )}

          <Separator />

          {venue.phone ? (
            <a
              href={`tel:${venue.phone}`}
              className="flex items-center justify-between text-muted-foreground hover:text-primary transition-colors"
            >
              <span className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-primary" /> Phone Number
              </span>
              <span className="font-medium">{venue.phone}</span>
            </a>
          ) : (
            <div className="flex justify-between text-muted-foreground">
              <span>Phone</span>
              <span>Not Provided</span>
            </div>
          )}

          {venue.website && (
            <>
              <Separator />
              <a
                href={venue.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-primary hover:underline"
              >
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-3.5 w-3.5 text-primary" /> Website
                </span>
                <span className="font-medium flex items-center gap-1">
                  Visit <ExternalLink className="h-3 w-3" />
                </span>
              </a>
            </>
          )}
        </div>
      </div>

      {/* Internal Notes */}
      {venue.notes && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" /> Internal Admin Notes
          </h4>
          <div className="p-3.5 rounded-xl border bg-muted/30 text-xs text-muted-foreground leading-relaxed">
            {venue.notes}
          </div>
        </div>
      )}

      {/* Edit Trigger */}
      <Button
        variant="outline"
        size="sm"
        className="w-full h-9 text-xs gap-2"
        onClick={onEditClick}
      >
        <Edit className="h-3.5 w-3.5" /> Edit Venue Information
      </Button>
    </div>
  );
}