"use client";

import { useMemo, useState } from "react";

import type { AdminBookingDetailsResponse } from "@/app/features/booking/types/admin-booking";
import {
  useAddBookingVenue,
  useBookingVenues,
  useUpdateBookingVenue,
  useVenueCandidates,
} from "@/app/features/venues/hooks/use-venues";
import type {
  BookingVenue,
  Venue,
} from "@/app/features/venues/types/venue";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Button } from "@/components/ui/button";

import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Loader2,
  Plus,
} from "lucide-react";
import AssignedVenues, { AssignedVenue } from "../actions/venue/assigned-venues";
import { VenueFinder } from "../actions/venue/venue-finder";
import { ResourceSourcingStatus } from "@/generated/prisma/enums";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatMoney } from "../../utils/utils";

interface BookingVenueTabProps {
  booking: AdminBookingDetailsResponse;
  onComplete: () => void
}

export function BookingVenueTab({
  booking,
  onComplete
}: BookingVenueTabProps) {
  const [isAssigning, setIsAssigning] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [minCapacity, setMinCapacity] = useState("");

  const [isAssignmentDetailsOpen, setIsAssignmentDetailsOpen] = useState(false);

const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);

const [editingBookingVenueId, setEditingBookingVenueId] = useState<string | null>(null);

const [agreedAmount, setAgreedAmount] = useState("");
const [currency, setCurrency] = useState("KES");

const [ venueAssignmentStatus,setVenueAssignmentStatus ] = useState<ResourceSourcingStatus>("CONSIDERING");

const isEditingAssignment = editingBookingVenueId !== null;

  const { data: assignedVenuesResponse,isLoading: isLoadingAssignedVenues } = useBookingVenues(booking.id);

  const assignedVenues: BookingVenue[] = assignedVenuesResponse?.data ?? [];

  const candidateParams = useMemo(() => {
    const params: {
      search?: string;
      country?: string;
      city?: string;
      minCapacity?: number;
    } = {};

    const search = searchTerm.trim();
    const country = filterCountry.trim();
    const city = filterCity.trim();
    const capacity = minCapacity.trim();

    if (search) {
      params.search = search;
    }

    if (country) {
      params.country = country;
    }

    if (city) {
      params.city = city;
    }

    if (capacity) {
      const parsedCapacity = Number(capacity);

      if (
        Number.isFinite(parsedCapacity) &&
        parsedCapacity >= 0
      ) {
        params.minCapacity = parsedCapacity;
      }
    }

    return params;
  }, [
    searchTerm,
    filterCountry,
    filterCity,
    minCapacity,
  ]);

  const {
    data: candidatesResponse,
    isLoading: isLoadingCandidates,
    isFetching: isFetchingCandidates,
  } = useVenueCandidates(booking.id, candidateParams);

  const candidateVenues: Venue[] = candidatesResponse?.data ?? [];

  const addBookingVenueMutation = useAddBookingVenue();

  const updateBookingVenueMutation = useUpdateBookingVenue();

  const hasFilters =
    searchTerm.trim() !== "" ||
    filterCountry.trim() !== "" ||
    filterCity.trim() !== "" ||
    minCapacity.trim() !== "";

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCountry("");
    setFilterCity("");
    setMinCapacity("");
  };

  function handleOpenAssignment(venueId: string) {
    setSelectedVenueId(venueId);
    setEditingBookingVenueId(null);

    setAgreedAmount("");
    setCurrency("KES");
    setVenueAssignmentStatus("CONSIDERING");

    setIsAssignmentDetailsOpen(true);
  }

  function handleOpenEditAssignment(
  bookingVenue: AssignedVenue
) {
  setSelectedVenueId(bookingVenue.venueId);
  setEditingBookingVenueId(bookingVenue.id);

  setAgreedAmount(
    bookingVenue.agreedAmount?.toString() ?? ""
  );

  setCurrency(bookingVenue.currency);

  setVenueAssignmentStatus(
    bookingVenue.status
  );

  setIsAssignmentDetailsOpen(true);
}

const dailyRatePerPerson = Number(agreedAmount) || 0;

const totalAgreedAmount = Math.round(
  dailyRatePerPerson * booking.participantCount * booking.course.durationDays * 100
) / 100;

  const handleRemove = (venueId: string) => {
    alert('To delete')
  };

  function handleSaveAssignment() {
  if (!selectedVenueId) {
    return;
  }

  const amount = Number(totalAgreedAmount);

  if (!Number.isFinite(amount) || amount <= 0) {
    return;
  }

  if (isEditingAssignment) {
    updateBookingVenueMutation.mutate(
      {
        bookingId: booking.id,
        venueId:selectedVenueId,
        data:{
          agreedAmount:String(amount),
          currency,
          status: venueAssignmentStatus,
        }
      },
      {
        onSuccess: () => {
          setIsAssignmentDetailsOpen(false);
          onComplete()
        },
      }
    );

    return;
  }

  addBookingVenueMutation.mutate(
    {
      bookingId: booking.id,
      data:{
        venueId: selectedVenueId,
      agreedAmount:String(amount),
      currency,
      status: venueAssignmentStatus
    }
    },
    {
      onSuccess: () => {
        setIsAssignmentDetailsOpen(false);
        setIsAssigning(false);
        onComplete()
      },
    }
  );
}

  const isAssigningVenue = addBookingVenueMutation.isPending;

  const isRemovingVenue = updateBookingVenueMutation.isPending;

  return (
    <>
    <div className="space-y-5 p-6">
      <Tabs defaultValue="assigned">
        <TabsList className="bg-primary">
          <TabsTrigger value="assigned" className="text-white">Assigned venues</TabsTrigger>
          <TabsTrigger value="venues" className="text-white">Find a venue</TabsTrigger>
        </TabsList>
        <TabsContent value="assigned">
           <div className="flex items-center justify-between my-5">
            <div className="space-y-0.5">
              <h4 className="font-medium tracking-wide">
                Assigned Training Venue
              </h4>
              <p className="text-sm tracking-wide text-muted-foreground">
                Manage the venue assigned to this training.
              </p>
            </div>
          </div>
          <AssignedVenues
          venues={assignedVenues}
          isLoading={isLoadingAssignedVenues}
          isRemoving={isRemovingVenue}
          onEdit={handleOpenEditAssignment}
          onRemove={handleRemove}
          onFindVenue={() => setIsAssigning(true)}
        />
        </TabsContent>
        <TabsContent value="venues">
          <div className="flex items-center justify-between my-5">
            <div className="space-y-0.5">
              <h4 className="font-medium tracking-wide">
                Find a Training Venue
              </h4>
              <p className="text-sm tracking-wide text-muted-foreground">
                Find a suitable venue for {booking.participantCount} {booking.participantCount > 1 ? 'participants' : 'participant'}
              </p>
            </div>
          </div>
          <VenueFinder
          candidateVenues={candidateVenues}
          isLoading={isLoadingCandidates}
          isFetching={isFetchingCandidates}
          isAssigningVenue={isAssigningVenue}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCountry={filterCountry}
          setFilterCountry={setFilterCountry}
          filterCity={filterCity}
          setFilterCity={setFilterCity}
          minCapacity={minCapacity}
          setMinCapacity={setMinCapacity}
          hasFilters={hasFilters}
          clearFilters={clearFilters}
          onAssign={handleOpenAssignment}
        />
        </TabsContent>
      </Tabs>
    </div>
    <Dialog
  open={isAssignmentDetailsOpen}
  onOpenChange={setIsAssignmentDetailsOpen}
>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>
        {isEditingAssignment
          ? "Edit Venue Assignment"
          : "Venue Assignment Details"}
      </DialogTitle>

      <DialogDescription>
        {isEditingAssignment
          ? "Update the commercial and sourcing details for this venue."
          : "Enter the agreed amount and sourcing status for this venue."}
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-4 py-2">
      {/* Agreed amount */}
      <div className="space-y-2">
        <label
          htmlFor="venue-agreed-amount"
          className="text-sm font-medium"
        >
          Venue rate per person per day
        </label>

        <Input
          id="venue-agreed-amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="e.g. 3500"
          value={agreedAmount}
          onChange={(event) =>
            setAgreedAmount(event.target.value)
          }
        />

        <p className="text-xs text-muted-foreground">
          Enter the agreed daily venue cost for one participant.
        </p>
      </div>

      {/* Currency */}
      <div className="space-y-2">
        <label
          htmlFor="venue-currency"
          className="text-sm font-medium"
        >
          Currency
        </label>

        <Select
          value={currency}
          onValueChange={setCurrency}
        >
          <SelectTrigger id="venue-currency">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="KES">
              KES — Kenyan Shilling
            </SelectItem>

            <SelectItem value="USD">
              USD — US Dollar
            </SelectItem>

            <SelectItem value="EUR">
              EUR — Euro
            </SelectItem>

            <SelectItem value="GBP">
              GBP — British Pound
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* venue cost breakdown */}

<div className="rounded-xl border bg-muted/40 p-4">
  <div className="space-y-3">
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">
        Rate per person / day
      </span>

      <span className="font-medium">
        {formatMoney(dailyRatePerPerson,booking.currency)}
      </span>
    </div>

    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">
        Participants
      </span>

      <span className="font-medium">
        {booking.participantCount}{" "}
        {booking.participantCount === 1 ? "person" : "people"}
      </span>
    </div>

    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">
        Training duration
      </span>

      <span className="font-medium">
        {booking.course.durationDays}{" "}
        {booking.course.durationDays === 1 ? "day" : "days"}
      </span>
    </div>

    <div className="border-t pt-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">
          Total agreed amount
        </span>

        <span className="text-lg font-semibold tracking-tight">
          {formatMoney(totalAgreedAmount, booking.currency)}
        </span>
      </div>
    </div>
  </div>
</div>


      {/* Status */}
      <div className="space-y-2">
        <label
          htmlFor="venue-assignment-status"
          className="text-sm font-medium"
        >
          Assignment Status
        </label>

        <Select
          value={venueAssignmentStatus}
          onValueChange={(value) =>
            setVenueAssignmentStatus(
              value as ResourceSourcingStatus
            )
          }
        >
          <SelectTrigger id="venue-assignment-status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="CONSIDERING">
              Considering
            </SelectItem>

            <SelectItem value="CONTACTED">
              Contacted
            </SelectItem>

            <SelectItem value="AVAILABLE">
              Available
            </SelectItem>

            <SelectItem value="CONFIRMED">
              Confirmed
            </SelectItem>

            {isEditingAssignment && (
              <>
                <SelectItem value="UNAVAILABLE">
                  Unavailable
                </SelectItem>

                <SelectItem value="REPLACED">
                  Replaced
                </SelectItem>

                <SelectItem value="CANCELLED">
                  Cancelled
                </SelectItem>
              </>
            )}
          </SelectContent>
        </Select>

        <p className="text-xs text-muted-foreground">
          {isEditingAssignment
            ? "Update the current sourcing status of this venue."
            : "Select the venue's current sourcing status for this booking."}
        </p>
      </div>
    </div>

    <div className="flex justify-end gap-2 pt-2">
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          setIsAssignmentDetailsOpen(false)
        }
        disabled={
          addBookingVenueMutation.isPending ||
          updateBookingVenueMutation.isPending
        }
      >
        Cancel
      </Button>

      <Button
        type="button"
        onClick={handleSaveAssignment}
        disabled={
          addBookingVenueMutation.isPending ||
          updateBookingVenueMutation.isPending ||
          !selectedVenueId ||
          !agreedAmount ||
          Number(agreedAmount) <= 0 ||
          !currency
        }
      >
        {addBookingVenueMutation.isPending ||
        updateBookingVenueMutation.isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <CheckCircle2 className="size-4" />

            {isEditingAssignment
              ? "Save Changes"
              : "Confirm Assignment"}
          </>
        )}
      </Button>
    </div>
  </DialogContent>
</Dialog>
    </>
);
}

