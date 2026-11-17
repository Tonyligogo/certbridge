
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { enquiryService } from "../services/enquiry";

import type {
  CreateEnquiryInput,
  GetEnquiriesParams,
  UpdateEnquiryDetailsInput,
  UpdateEnquiryStatusInput,
} from "../types";

import type {
  AddEnquiryNoteInput,
  ConvertEnquiryInput,
} from "../lib/validation/enquiry";

import { queryKeys } from "@/lib/react-query/query-keys";

// -------------------------------------
// Cache invalidation
// -------------------------------------

function useInvalidateEnquiries() {
  const queryClient = useQueryClient();

  return async (enquiryId: string) => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: queryKeys.enquiries.lists(),
      }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.enquiries.detail(enquiryId),
      }),
    ]);
  };
}

// -------------------------------------
// Create enquiry
// -------------------------------------

export function useCreateEnquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateEnquiryInput) => {
      const response = await enquiryService.createEnquiry(data);
      return response.data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.enquiries.lists(),
      });
    },
  });
}

// -------------------------------------
// List enquiries
// -------------------------------------

export function useAdminEnquiries(
  params: GetEnquiriesParams,
) {
  return useQuery({
    queryKey: queryKeys.enquiries.list(params),

    queryFn: async () => {
      const response = await enquiryService.getEnquiries(params);
      return response.data;
    },

    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

// -------------------------------------
// Enquiry details
// -------------------------------------

export function useEnquiryDetails(
  enquiryId: string | null,
) {
  return useQuery({
    queryKey: queryKeys.enquiries.detail(enquiryId ?? ""),

    queryFn: async () => {
      if (!enquiryId) {
        throw new Error("Enquiry ID is required.");
      }

      const response =
        await enquiryService.getEnquiryDetails(enquiryId);

      return response.data;
    },

    enabled: Boolean(enquiryId),
    staleTime: 30_000,
    retry: 1,
  });
}

// -------------------------------------
// Edit enquiry details
// -------------------------------------

export function useUpdateEnquiryDetails() {
  const invalidate = useInvalidateEnquiries();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateEnquiryDetailsInput;
    }) => {
      const response =
        await enquiryService.updateEnquiryDetails(id, input);

      return response.data;
    },

    onSuccess: async (_, variables) => {
      await Promise.all([
        invalidate(variables.id),

        // Commercial changes may void outstanding quotations.
        queryClient.invalidateQueries({
          queryKey: queryKeys.enquiries.quotes(variables.id),
        }),
      ]);
    },
  });
}

// -------------------------------------
// Update enquiry status
// -------------------------------------

export function useUpdateEnquiryStatus() {
  const invalidate = useInvalidateEnquiries();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateEnquiryStatusInput;
    }) => {
      const response =
        await enquiryService.updateEnquiryStatus(id, input);

      return response.data;
    },

    onSuccess: async (_, variables) => {
      await Promise.all([
        invalidate(variables.id),

        // Closing an enquiry may void its quotations.
        queryClient.invalidateQueries({
          queryKey: queryKeys.enquiries.quotes(variables.id),
        }),
      ]);
    },
  });
}

// -------------------------------------
// Add activity note
// -------------------------------------

export function useAddEnquiryNote() {
  const invalidate = useInvalidateEnquiries();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: AddEnquiryNoteInput;
    }) => {
      const response = await enquiryService.addNote(id, input);
      return response.data;
    },

    onSuccess: async (_, variables) => {
      await invalidate(variables.id);
    },
  });
}

// -------------------------------------
// Convert enquiry to booking
// -------------------------------------

export function useConvertEnquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: ConvertEnquiryInput;
    }) => {
      const response =
        await enquiryService.convertEnquiry(id, input);

      return response;
    },

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.enquiries.all(),
        }),

        queryClient.invalidateQueries({
          queryKey: queryKeys.enquiries.quotes(variables.id),
        }),

        // Conversion creates a booking.
        queryClient.invalidateQueries({
          queryKey: queryKeys.bookings.all(),
        }),
      ]);
    },
  });
}
