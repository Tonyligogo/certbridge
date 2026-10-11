"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { Plus } from "lucide-react";
import { GetTrainersParams, Trainer } from "@/app/features/trainers/services/trainer-service";
import { useDeleteTrainer, useTrainers } from "@/app/features/trainers/hooks/use-trainers";
import { TrainerFormDialog } from "@/app/features/trainers/components/TrainerDialog";
import TrainersTable from "@/app/features/trainers/components/TrainersTable";
import TrainersFiltersBar from "@/app/features/trainers/components/TrainersFiltersBar";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { TrainerDetailSheet } from "@/app/features/trainers/components/TrainerDetailSheet";

export default function TrainersPage() {
  // Query Filter State
  const [params, setParams] = useState<GetTrainersParams>({
    page: 1,
    pageSize: 10,
    search: "",
    status: undefined,
    certified: undefined,
  });

  // Local state for modals and actions
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [trainerToDelete, setTrainerToDelete] = useState<Trainer | null>(null);
  const [isViewTrainerOpen, setIsViewTrainerOpen] = useState(false);
  // Queries & Mutations
  const { data, isLoading, isError, refetch, isFetching } = useTrainers(params);
  const { mutate: deleteTrainer, isPending: isDeleting } = useDeleteTrainer();

  const trainers = data?.data?.trainers || [];
  const pagination = data?.data?.pagination || {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  };
  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams((prev) => ({
      ...prev,
      search: e.target.value,
      page: 1, // Reset to first page on search
    }));
  };

  const handleStatusFilter = (value: string) => {
    setParams((prev) => ({
      ...prev,
      status:
        value === "ALL"
          ? undefined
          : (value as "ACTIVE" | "INACTIVE" | "SUSPENDED"),
      page: 1,
    }));
  };

  const handleCertifiedFilter = (value: string) => {
    setParams((prev) => ({
      ...prev,
      certified:
        value === "ALL" ? undefined : value === "true",
      page: 1,
    }));
  };

  const handleEdit = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setIsFormOpen(true);
  };

  const handleViewTrainer = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setIsViewTrainerOpen(true);
  }

  const handleCreate = () => {
    setSelectedTrainer(null);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!trainerToDelete) return;

    deleteTrainer(trainerToDelete.id, {
      onSuccess: () => {
        toast.success(
          `Trainer "${trainerToDelete.firstName} ${trainerToDelete.lastName}" removed.`
        );
        setTrainerToDelete(null);
      },
      onError: (err: Error) => {
        toast.error(err?.message || "Failed to remove trainer.");
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trainers</h1>
          <p className="text-sm text-muted-foreground">
            Manage qualified trainers, track certification statuses, and view assigned courses.
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Add Trainer
        </Button>
      </div>

      {/* Filters Bar */}
      <TrainersFiltersBar
        params={params}
        handleSearchChange={handleSearchChange}
        handleStatusFilter={handleStatusFilter}
        handleCertifiedFilter={handleCertifiedFilter}
        refetch={refetch}
        isFetching={isFetching}
      />
      {/* Trainers Table */}
      <TrainersTable
        trainers={trainers}
        isLoading={isLoading}
        isError={isError}
        pagination={pagination}
        setParams={setParams}
        isFetching={isFetching}
        handleEdit={handleEdit}
        setTrainerToDelete={setTrainerToDelete}
        handleViewTrainer={handleViewTrainer}
      />

      {/* Reusable Trainer Create / Edit Dialog */}
      <TrainerFormDialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedTrainer(null);
        }}
        trainer={selectedTrainer}
        onSuccess={() => refetch()}
      />

      {/* Delete Confirmation Alert */}
      <ConfirmDialog
        open={!!trainerToDelete}
        onOpenChange={(open) => !open && setTrainerToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Trainer"
        description={`Are you sure you want to remove ${trainerToDelete?.firstName} ${trainerToDelete?.lastName}? This action will disassociate them from assigned bookings and courses.`}
        isLoading={isDeleting}
        variant="destructive"
        action="Remove"
      />
      {/* Trainer Information sheet */}
      <TrainerDetailSheet
        trainer={selectedTrainer}
        isOpen={isViewTrainerOpen}
        onClose={() => { 
          setIsViewTrainerOpen(false);
          setSelectedTrainer(null);
         }}
        onEdit={() => {
          setIsFormOpen(true);
          setSelectedTrainer(selectedTrainer);
        }}
      />
    </div>
  );
}