import { api } from "@/lib/api";

import type {
  CreateTrainerInput,
  UpdateTrainerInput,
  UpdateTrainerCoursesInput,
  CreateTrainerCertificationInput,
  UpdateTrainerCertificationInput,
  AssignTrainerInput,
  UpdateAssignedTrainerInput,
} from "../lib/trainer-schema";

export interface TrainerCourse {
  id: string;
  courseId: string;
  course: {
    id: string;
    title: string;
    slug: string;
    status?: string;
  };
}

export interface TrainerCertification {
  id: string;
  trainerId: string;
  name: string;
  issuedBy: string | null;
  issuedAt: string | null;
  expiresAt: string | null;
  status: "PENDING" | "VALID" | "EXPIRED" | "REJECTED";
  storagePath: string;
  createdAt: string;
  updatedAt: string;
}

export interface Trainer {
  id: string;

  firstName: string;
  lastName: string;

  email: string;
  phone: string;

  primaryCountry: string | null;
  primaryCity: string | null;

  expertise: string | null;
  yearsOfExperience: number | null;
  languages: string | null;

  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  certified: boolean;

  createdAt: string;
  updatedAt: string;

  courses: TrainerCourse[];
  certifications: TrainerCertification[];

  _count?: {
    bookings: number;
  };
}

export interface TrainerPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface GetTrainersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  certified?: boolean;
  courseId?: string;
}

export interface TrainersResponse {
    trainers: Trainer[];
    pagination: TrainerPagination;
}

export type TrainerResponse = Trainer;

export interface CertificationResponse {
  success: boolean;
  message?: string;
  data: TrainerCertification;
}

export interface CertificationsResponse {
  data: TrainerCertification[];
}

export interface BookingTrainer {
  id: string;

  bookingId: string;
  trainerId: string;

  role: "LEAD" | "ASSISTANT";

  agreedAmount: string | number | null;
  currency: string;

  assignedAt: string;

  notes: string | null;

  trainer: Trainer;
}

export interface BookingTrainersResponse {
  success: boolean;
  data: BookingTrainer[];
}

export interface BookingTrainerResponse {
  success: boolean;
  message?: string;
  data: BookingTrainer;
}

export const trainerService = {
  /**
   * Get paginated trainers.
   */
  async getTrainers(
    params: GetTrainersParams = {}
  ){
    const searchParams = new URLSearchParams();

    if (params.page !== undefined) {
      searchParams.set("page", String(params.page));
    }

    if (params.pageSize !== undefined) {
      searchParams.set("pageSize", String(params.pageSize));
    }

    if (params.search) {
      searchParams.set("search", params.search);
    }

    if (params.status) {
      searchParams.set("status", params.status);
    }

    if (params.certified !== undefined) {
      searchParams.set(
        "certified",
        String(params.certified)
      );
    }

    if (params.courseId) {
      searchParams.set("courseId", params.courseId);
    }

    const query = searchParams.toString();

    const response =  api.get<TrainersResponse>(
      `/api/admin/trainers${query ? `?${query}` : ""}`
    );
    return response;
  },

  /**
   * Get a single trainer.
   */
  async getTrainer(id: string) {
    return api.get<TrainerResponse>(
      `/api/admin/trainers/${id}`
    );
  },

  /**
   * Create a trainer.
   */
  async createTrainer(
    data: CreateTrainerInput
  ){
    const response = await api.post<TrainerResponse>(
      "/api/admin/trainers",
      data
    );
    return response;
  },

  /**
   * Update trainer profile information.
   */
  async updateTrainer(
    id: string,
    data: UpdateTrainerInput
  ) {
    return api.patch<TrainerResponse>(
      `/api/admin/trainers/${id}`,
      data
    );
  },

  /**
   * Deactivate trainer.
   */
  async deleteTrainer(id: string) {
    return api.delete<TrainerResponse>(
      `/api/admin/trainers/${id}`
    );
  },

  /**
   * Replace the trainer's course associations.
   */
  async updateTrainerCourses(
    id: string,
    data: UpdateTrainerCoursesInput
  ) {
    return api.put<TrainerResponse>(
      `/api/admin/trainers/${id}/courses`,
      data
    );
  },

  /**
   * Get trainer certifications.
   */
  async getCertifications(
    trainerId: string
  ) {
    return api.get<TrainerCertification[]>(
      `/api/admin/trainers/${trainerId}/certifications`
    );
  },

  /**
   * Add a certification record.
   */
  async createCertification(
    trainerId: string,
    data: CreateTrainerCertificationInput
  ) {
    return api.post<CertificationResponse>(
      `/api/admin/trainers/${trainerId}/certifications`,
      data
    );
  },

  /**
   * Update certification metadata/status.
   */
  async updateCertification(
    trainerId: string,
    certificationId: string,
    data: UpdateTrainerCertificationInput
  ) {
    return api.patch<CertificationResponse>(
      `/api/admin/trainers/${trainerId}/certifications/${certificationId}`,
      data
    );
  },

  // replace certification file
  async replaceCertificationFile(
  trainerId: string,
  certificationId: string,
  file: File
){
  return api.put<CertificationResponse>(
    `/api/trainers/${trainerId}/certifications/${certificationId}/file`,
    file
  );
},

  /**
   * Delete certification.
   */
  async deleteCertification(
    trainerId: string,
    certificationId: string
  ) {
    return api.delete<{
      success: boolean;
      message: string;
    }>(
      `/api/admin/trainers/${trainerId}/certifications/${certificationId}`
    );
  },

  /**
   * Get trainers already assigned to a booking.
   */
  async getBookingTrainers(
    bookingId: string
  ) {
    return api.get<BookingTrainersResponse>(
      `/api/admin/bookings/${bookingId}/trainers`
    );
  },

  /**
   * Get trainers who can potentially deliver the booking's course.
   */
  async getTrainerCandidates(
    bookingId: string,
    search?: string
  ){
    const query = search
      ? `?search=${encodeURIComponent(search)}`
      : "";

    const response = await api.get<TrainerResponse[]>(
      `/api/admin/bookings/${bookingId}/trainers/candidates${query}`
    );

    return response;
  },

  /**
   * Assign a trainer to a booking.
   */
  async assignTrainer(
    bookingId: string,
    data: AssignTrainerInput
  ) {
    return api.post<BookingTrainerResponse>(
      `/api/admin/bookings/${bookingId}/trainers`,
      data
    );
  },
  /**
   * Update a trainer Assigned to a booking.
   */
  async updateAssignedTrainer(
    bookingId: string,
    trainerId: string,
    data: UpdateAssignedTrainerInput
  ) {
    return api.patch<BookingTrainerResponse>(
      `/api/admin/bookings/${bookingId}/trainers/${trainerId}`,
      data
    );
  },

  /**
   * Remove/release a trainer from a booking.
   */
  async removeTrainer(
    bookingId: string,
    trainerId: string
  ) {
    return api.delete<BookingTrainerResponse>(
      `/api/admin/bookings/${bookingId}/trainers/${trainerId}`
    );
  },
};