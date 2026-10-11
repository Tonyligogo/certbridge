import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  trainerService,
  type GetTrainersParams,
} from "../services/trainer-service";

import type {
  CreateTrainerInput,
  UpdateTrainerInput,
  UpdateTrainerCoursesInput,
  CreateTrainerCertificationInput,
  UpdateTrainerCertificationInput,
  AssignTrainerInput,
  UpdateAssignedTrainerInput,
} from "../lib/trainer-schema";
import { queryKeys } from "@/lib/react-query/query-keys";
import { certificationStorageService } from "../services/certification-storage-service";

// get trainers
export function useTrainers(params: GetTrainersParams = {}) {
  return useQuery({
    queryKey: queryKeys.trainers.list(params),
    queryFn: () => trainerService.getTrainers(params),
  });
}

// get single trainer
export function useTrainer(id: string) {
  return useQuery({
    queryKey: queryKeys.trainers.detail(id),
    queryFn: () => trainerService.getTrainer(id),
    enabled: !!id,
  });
}

// create trainer
export function useCreateTrainer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTrainerInput) =>
      trainerService.createTrainer(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.trainers.lists(),
      });
    },
  });
}

// update trainer
export function useUpdateTrainer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateTrainerInput;
    }) => trainerService.updateTrainer(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.trainers.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.trainers.detail(variables.id),
      });
    },
  });
}

// deactivate trainer
export function useDeleteTrainer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      trainerService.deleteTrainer(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.trainers.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.trainers.detail(id),
      });
    },
  });
}

// update trainer courses
export function useUpdateTrainerCourses() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateTrainerCoursesInput;
    }) => trainerService.updateTrainerCourses(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.trainers.detail(variables.id),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.trainers.lists(),
      });
    },
  });
}

// fetch certifications for a trainer
export function useTrainerCertifications(trainerId: string) {
  return useQuery({
    queryKey: queryKeys.trainers.certifications(trainerId),
    queryFn: () =>
      trainerService.getCertifications(trainerId),
    enabled: !!trainerId,
  });
}

// create certification for a trainer
export function useCreateTrainerCertification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      trainerId,
      data,
    }: {
      trainerId: string;
      data: CreateTrainerCertificationInput;
    }) =>
      trainerService.createCertification(trainerId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.trainers.certifications(
          variables.trainerId
        ),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.trainers.detail(
          variables.trainerId
        ),
      });
    },
  });
}

// upload file for a trainer's certification
export function useUploadTrainerCertification() {
  return useMutation({
    mutationFn: ({
      trainerId,
      file,
    }: {
      trainerId: string;
      file: File;
    }) =>
      certificationStorageService.upload(
        trainerId,
        file
      ),
  });
}

// update certification for a trainer
export function useUpdateTrainerCertification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      trainerId,
      certificationId,
      data,
    }: {
      trainerId: string;
      certificationId: string;
      data: UpdateTrainerCertificationInput;
    }) =>
      trainerService.updateCertification(
        trainerId,
        certificationId,
        data
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.trainers.certifications(
          variables.trainerId
        ),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.trainers.detail(
          variables.trainerId
        ),
      });
    },
  });
}

// replace certification file for a trainer
export function useReplaceTrainerCertificationFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      trainerId,
      certificationId,
      file,
    }: {
      trainerId: string;
      certificationId: string;
      file: File;
    }) =>
      certificationStorageService.replaceFile(
        trainerId,
        certificationId,
        file
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.trainers.certifications(
          variables.trainerId
        ),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.trainers.detail(
          variables.trainerId
        ),
      });
    },
  });
}

// delete certification for a trainer
export function useDeleteTrainerCertification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      trainerId,
      certificationId,
    }: {
      trainerId: string;
      certificationId: string;
    }) =>
      trainerService.deleteCertification(
        trainerId,
        certificationId
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.trainers.certifications(
          variables.trainerId
        ),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.trainers.detail(
          variables.trainerId
        ),
      });
    },
  });
}

// fetch assigned trainers for a booking
export function useBookingTrainers(bookingId: string) {
  return useQuery({
    queryKey: queryKeys.bookings.trainers(bookingId),
    queryFn: () =>
      trainerService.getBookingTrainers(bookingId),
    enabled: !!bookingId,
  });
}

// fetch trainer candidates for a booking
export function useTrainerCandidates(
  bookingId: string,
  search: string
) {
  return useQuery({
    queryKey: queryKeys.bookings.trainerCandidates(
      bookingId,
      search
    ),
    queryFn: () =>
      trainerService.getTrainerCandidates(
        bookingId,
        search
      ),
    enabled: !!bookingId && !!search,
  });
}

// assign a trainer to a booking
export function useAssignTrainer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      data,
    }: {
      bookingId: string;
      data: AssignTrainerInput;
    }) =>
      trainerService.assignTrainer(
        bookingId,
        data
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.adminDetail(
          variables.bookingId
        ),
      });
    },
  });
}

// update a trainer assigned to a booking
export function useUpdateAssignedTrainer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      trainerId,
      data,
    }: {
      bookingId: string;
      trainerId: string;
      data: UpdateAssignedTrainerInput;
    }) =>
      trainerService.updateAssignedTrainer(
        bookingId,
        trainerId,
        data
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.adminDetail(
          variables.bookingId
        ),
      });
    },
  });
}

// remove a trainer from a booking
export function useRemoveTrainer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      trainerId,
    }: {
      bookingId: string;
      trainerId: string;
    }) =>
      trainerService.removeTrainer(
        bookingId,
        trainerId
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.adminDetail(
          variables.bookingId
        ),
      });
    },
  });
}