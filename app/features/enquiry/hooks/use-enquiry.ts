import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { enquiryService } from "../services/enquiry";
import type { CreateEnquiryInput, GetEnquiriesParams } from "../types";
import { queryKeys } from "@/lib/react-query/query-keys";
import type { AddEnquiryNoteInput, UpdateEnquiryInput } from "../lib/validation/enquiry";

export function useCreateEnquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEnquiryInput) =>
      enquiryService.createEnquiry(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.enquiries.lists(),
      });
    },
  });
}

export function useAdminEnquiries(params: GetEnquiriesParams) {
  return useQuery({
    queryKey: queryKeys.enquiries.list(),
    queryFn: () => enquiryService.getEnquiries(params),
    placeholderData: keepPreviousData,
  });
}

export function useEnquiryDetails(
  enquiryId: string | null
) {
  return useQuery({
    queryKey: queryKeys.enquiries.detail(enquiryId ?? ""),

    queryFn: async () => {
      if (!enquiryId) {
        throw new Error("Enquiry ID is required");
      }

      const response =
        await enquiryService.getEnquiryDetails(enquiryId);

      if (!response.success || !response.data) {
        throw new Error(
          response.message ?? "Failed to load enquiry details"
        );
      }

      return response.data;
    },

    enabled: Boolean(enquiryId),
    staleTime: 30_000,
    retry: 1,
  });
}

function useInvalidateEnquiries() {
  const queryClient = useQueryClient();

  return async (id: string) => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: queryKeys.enquiries.lists(),
      }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.enquiries.detail(id),
      }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.enquiries.all(),
      }),
    ]);
  };
}

export function useUpdateEnquiry() {
  const invalidate = useInvalidateEnquiries();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateEnquiryInput;
    }) => {
      const response = await enquiryService.updateEnquiry(
        id,
        input
      );

      if (!response.success) {
        throw new Error(
          response.message || "Failed to update enquiry"
        );
      }

      return response.data;
    },

    onSuccess: async (_, variables) => {
      await invalidate(variables.id);
    }
  });
}

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
      const response = await enquiryService.addNote(
        id,
        input
      );

      if (!response.success) {
        throw new Error(
          response.message || "Failed to add note"
        );
      }

      return response.data;
    },

    onSuccess: async (_, variables) => {
      await invalidate(variables.id);
    }
  });
}