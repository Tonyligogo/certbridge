"use client";

import { useState, useMemo } from "react";
import { AdminBookingDetailsResponse } from "@/app/features/booking/types/admin-booking";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  UserCheck,
  Trash2,
  Search,
  MapPin,
  Award,
  Loader2,
  CheckCircle2,
  FilterX,
  Pencil,
} from "lucide-react";
import {
  useAssignTrainer,
  useRemoveTrainer,
  useTrainerCandidates,
  useUpdateAssignedTrainer,
} from "@/app/features/trainers/hooks/use-trainers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ResourceSourcingStatus,
  TrainerAssignmentRole,
  TrainerStatus,
} from "@/generated/prisma/enums";

export interface CandidateTrainer {
  id: string;
  firstName: string;
  lastName: string;
  expertise?: string | null;
  primaryCity?: string | null;
  primaryCountry?: string | null;
  certifications?: Array<{
    id: string;
    name: string;
    issuedBy: string;
    expiresAt?: string | null;
  }>;
  bookings?: Array<{
    id: string;
    role: string;
  }>;
}

interface AssignedTrainer {
  id: string;
  currency: string;
  status: ResourceSourcingStatus;
  createdAt: string;
  updatedAt: string;
  role: TrainerAssignmentRole;
  agreedAmount: string | null;
  notes: string | null;
  confirmedAt: string | null;
  trainer: {
    id: string;
    status: TrainerStatus;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    primaryCountry: string | null;
    primaryCity: string | null;
    expertise: string | null;
    yearsOfExperience: number | null;
    certified: boolean;
  };
}

export function BookingTrainerTab({
  booking,
  onComplete,
}: {
  booking: AdminBookingDetailsResponse;
  onComplete: () => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCity, setFilterCity] = useState<string>("ALL");
  const [requireCertifications, setRequireCertifications] =
    useState<boolean>(false);
  const [isAssignmentDetailsOpen, setIsAssignmentDetailsOpen] = useState(false);
  const [selectedTrainerId, setSelectedTrainerId] = useState<string | null>(
    null,
  );
  const [editingBookingTrainerId, setEditingBookingTrainerId] = useState<
    string | null
  >(null);
  const [agreedAmount, setAgreedAmount] = useState("");
  const [trainerAssignmentStatus, setTrainerAssignmentStatus] =
    useState<ResourceSourcingStatus>("CONSIDERING");
  const [currency, setCurrency] = useState("KES");
  const isEditingAssignment = editingBookingTrainerId !== null;

  // React Query Hooks
  const { data: candidatesResponse, isLoading: isLoadingCandidates } =
    useTrainerCandidates(booking.id, searchTerm);
  const assignTrainerMutation = useAssignTrainer();
  const removeTrainerMutation = useRemoveTrainer();
  const updateTrainerMutation = useUpdateAssignedTrainer();

  const candidateTrainers = candidatesResponse?.data;
  const assignedTrainers = booking.trainers;

  // Filter candidates locally for city & certifications preference
  const filteredCandidates = useMemo(() => {
    if (!candidateTrainers) return [];
    return candidateTrainers.filter((trainer) => {
      // Filter out trainers who are already assigned to this booking
      const isAlreadyAssigned = assignedTrainers.some(
        (at) => at.trainer.id === trainer.id,
      );
      if (isAlreadyAssigned) return false;

      // Filter by city if selected
      if (
        filterCity !== "ALL" &&
        trainer.primaryCity?.toLowerCase() !== filterCity.toLowerCase()
      ) {
        return false;
      }

      // Filter by certification availability
      if (
        requireCertifications &&
        (!trainer.certifications || trainer.certifications.length === 0)
      ) {
        return false;
      }

      return true;
    });
  }, [candidateTrainers, assignedTrainers, filterCity, requireCertifications]);

  // Unique cities list for the filter dropdown
  const uniqueCities = useMemo(() => {
    const cities = new Set<string>();
    candidateTrainers?.forEach((t) => {
      if (t.primaryCity) cities.add(t.primaryCity);
    });
    return Array.from(cities);
  }, [candidateTrainers]);

  function handleOpenAssignment(trainerId: string) {
    setSelectedTrainerId(trainerId);
    setEditingBookingTrainerId(null);

    setAgreedAmount("");
    setCurrency("KES");
    setTrainerAssignmentStatus("CONSIDERING");

    setIsAssignmentDetailsOpen(true);
  }
  function handleOpenEditAssignment(bookingTrainer: AssignedTrainer) {
    setSelectedTrainerId(bookingTrainer.trainer.id);

    setEditingBookingTrainerId(bookingTrainer.id);

    setAgreedAmount(bookingTrainer.agreedAmount?.toString() ?? "");

    setCurrency(bookingTrainer.currency);

    setTrainerAssignmentStatus(bookingTrainer.status);

    setIsAssignmentDetailsOpen(true);
  }

  const handleRemove = (trainerId: string) => {
    removeTrainerMutation.mutate({
      bookingId: booking.id,
      trainerId,
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCity("ALL");
    setRequireCertifications(false);
  };
  function handleSaveAssignment() {
    if (!selectedTrainerId) {
      return;
    }

    const numericAmount = Number(agreedAmount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return;
    }

    if (isEditingAssignment && editingBookingTrainerId) {
      updateTrainerMutation.mutate(
        {
          bookingId: booking.id,
          trainerId: selectedTrainerId,
        data: {
          agreedAmount,
          currency,
          status: trainerAssignmentStatus,
        }
        },
        {
          onSuccess: () => {
            setIsAssignmentDetailsOpen(false);
          setSelectedTrainerId(null);
          setAgreedAmount("");
          setCurrency("KES");
          setTrainerAssignmentStatus("CONSIDERING");
          onComplete();
          },
        },
      );

      return;
    }

    assignTrainerMutation.mutate(
      {
        bookingId: booking.id,
        data: {
          trainerId: selectedTrainerId,
          agreedAmount,
          currency,
          status: trainerAssignmentStatus,
        }
      },
      {
        onSuccess: () => {
         setIsAssignmentDetailsOpen(false);
          setSelectedTrainerId(null);
          setAgreedAmount("");
          setCurrency("KES");
          setTrainerAssignmentStatus("CONSIDERING");
          onComplete();
        },
      },
    );
  }
  return (
    <div className="p-6 space-y-6 m-0">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <UserCheck className="h-3.5 w-3.5" /> Assigned Course Trainers
          </h4>
          <p className="text-[11px] text-muted-foreground">
            Manage trainers assigned to facilitate this booking.
          </p>
        </div>
      </div>

      {/* Assigned Trainers List */}
      {assignedTrainers.length === 0 ? (
        <div className="p-8 border border-dashed rounded-xl text-center space-y-3 bg-muted/20">
          <User className="h-8 w-8 mx-auto text-muted-foreground/60" />
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">
              No Trainer Assigned Yet
            </p>
            <p>
              Assign a qualified trainer to lead or co-facilitate this course.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {assignedTrainers.map((at) => {
            const initials = `${at.trainer.firstName?.[0] || ""}${
              at.trainer.lastName?.[0] || ""
            }`.toUpperCase();

            return (
              <div
                key={at.trainer.id}
                className="p-4 rounded-xl border bg-card flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border shrink-0">
                    <AvatarFallback className="text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {at.trainer.firstName} {at.trainer.lastName}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  size="lg"
                  variant="outline"
                  className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
                  onClick={() => handleOpenEditAssignment({
                    ...at,
                    agreedAmount: at.agreedAmount?.toString() ?? null,
                  })}
                >
                  {removeTrainerMutation.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Pencil className="h-3.5 w-3.5" />
                  )}
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
                  onClick={() => handleRemove(at.trainer.id)}
                  disabled={removeTrainerMutation.isPending}
                >
                  {removeTrainerMutation.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                  Remove
                </Button>
              </div>
            );
          })}
        </div>
      )}

      <div>
        <div className="p-4 border rounded-xl space-y-3">
          <div>
            <h4 className="font-medium text-base">Trainer Finder</h4>
            <span className="text-muted-foreground text-sm">
              Search and filter certified trainers for course{" "}
              {booking.course.title}
            </span>
          </div>
          {/* Search + Role */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-muted-foreground" />
              <Input
                placeholder="Search by name, expertise, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-8 text-xs"
              />
            </div>
            {/* Location Filter */}
            <Select value={filterCity} onValueChange={setFilterCity}>
              <SelectTrigger className="h-7 text-[11px] w-35">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs">
                  All Cities
                </SelectItem>
                {uniqueCities.map((city) => (
                  <SelectItem key={city} value={city} className="text-xs">
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Valid Certifications Toggle */}
            <Button
              size="sm"
              variant={requireCertifications ? "default" : "outline"}
              className="h-7 text-[11px] gap-1 bg-white"
              onClick={() => setRequireCertifications(!requireCertifications)}
            >
              <Award className="h-3 w-3" /> Has Valid Certifications
            </Button>

            {(searchTerm || filterCity !== "ALL" || requireCertifications) && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-[11px] gap-1 bg-white"
                onClick={clearFilters}
              >
                <FilterX className="h-3 w-3" /> Clear Filters
              </Button>
            )}
          </div>
          {/* Candidate List Scroll Area */}
          <div className="min-h-0 overflow-y-auto">
            {isLoadingCandidates ? (
              <div className="space-y-2 py-12 text-center text-xs text-muted-foreground">
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                <p>Loading eligible trainer candidates...</p>
              </div>
            ) : filteredCandidates.length === 0 ? (
              <div className="space-y-2 rounded-xl border border-dashed py-12 text-center text-xs text-muted-foreground">
                <p className="font-semibold text-foreground">
                  No Matching Candidates
                </p>
                <p>Try adjusting your search query or filter criteria.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border mt-5">
                <Table>
                  <TableHeader className="hidden md:table-header-group">
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead>Trainer</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Certifications</TableHead>
                      <TableHead className="w-25 text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredCandidates.map((candidate) => {
                      const location = [
                        candidate.primaryCity,
                        candidate.primaryCountry,
                      ]
                        .filter(Boolean)
                        .join(", ");

                      const certificationCount =
                        candidate.certifications?.length ?? 0;

                      return (
                        <TableRow
                          key={candidate.id}
                          className="
                  block border-b p-4 last:border-b-0
                  hover:bg-muted/30
                  md:table-row md:p-0
                "
                        >
                          {/* Trainer */}
                          <TableCell>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-foreground">
                                {candidate.firstName} {candidate.lastName}
                              </p>

                              {candidate.expertise && (
                                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                                  {candidate.expertise}
                                </p>
                              )}
                            </div>
                          </TableCell>

                          {/* Location */}
                          <TableCell>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5 shrink-0" />

                              <span>{location || "Not specified"}</span>
                            </div>
                          </TableCell>

                          {/* Certifications */}
                          <TableCell>
                            {certificationCount > 0 ? (
                              <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                <Award className="h-3 w-3" />
                                {certificationCount}{" "}
                                {certificationCount === 1
                                  ? "Valid Cert"
                                  : "Valid Certs"}
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                No Active/Valid Certs
                              </span>
                            )}
                          </TableCell>

                          {/* Action */}
                          <TableCell>
                            <Button
                              size="sm"
                              className="h-8 w-full gap-1.5 text-xs md:w-auto"
                              onClick={() => handleOpenAssignment(candidate.id)}
                              disabled={assignTrainerMutation.isPending}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Assign
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= CANDIDATE SELECTION DIALOG ================= */}
      <Dialog
        open={isAssignmentDetailsOpen}
        onOpenChange={setIsAssignmentDetailsOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditingAssignment
                ? "Edit Trainer Assignment"
                : "Trainer Assignment Details"}
            </DialogTitle>
            <DialogDescription>
              {isEditingAssignment
                ? "Update the payment and sourcing details for this trainer."
                : "Enter the agreed payment amount, currency, and sourcing status for this trainer."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="agreedAmount" className="text-sm font-medium">
                Agreed Amount
              </label>

              <Input
                id="agreedAmount"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 25000"
                value={agreedAmount}
                onChange={(e) => setAgreedAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="currency" className="text-sm font-medium">
                Currency
              </label>

              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="KES">KES — Kenyan Shilling</SelectItem>
                  <SelectItem value="USD">USD — US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR — Euro</SelectItem>
                  <SelectItem value="GBP">GBP — British Pound</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="trainer-assignment-status"
                className="text-sm font-medium"
              >
                Trainer assignment status
              </label>

              <Select
                value={trainerAssignmentStatus}
                onValueChange={(value) =>
                  setTrainerAssignmentStatus(value as ResourceSourcingStatus)
                }
              >
                <SelectTrigger id="trainer-assignment-status">
                  <SelectValue placeholder="Select the status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="CONSIDERING">Considering</SelectItem>

                  <SelectItem value="CONTACTED">Contacted</SelectItem>

                  <SelectItem value="AVAILABLE">Available</SelectItem>

                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                </SelectContent>
              </Select>

              <p className="text-xs text-muted-foreground">
                {isEditingAssignment
                  ? "Update the trainer's current sourcing status."
                  : "Select the trainer's current sourcing status for this booking."}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAssignmentDetailsOpen(false)}
              disabled={
                assignTrainerMutation.isPending ||
                updateTrainerMutation.isPending
              }
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleSaveAssignment}
              disabled={
                assignTrainerMutation.isPending ||
                updateTrainerMutation.isPending ||
                !selectedTrainerId ||
                !agreedAmount ||
                Number(agreedAmount) <= 0 ||
                !currency
              }
            >
              {assignTrainerMutation.isPending ||
              updateTrainerMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" />

                  {isEditingAssignment ? "Save Changes" : "Confirm Assignment"}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
