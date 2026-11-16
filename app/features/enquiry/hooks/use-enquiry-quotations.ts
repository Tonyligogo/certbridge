
"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { enquiryQuotationService } from "../services/enquiry-quotation-service";

import type {
    CreateEnquiryQuoteInput,
  UpdateEnquiryQuoteInput,
  SendEnquiryQuoteInput,
  UpdateEnquiryQuoteStatusInput,
  VoidEnquiryQuoteInput,
} from "../types";

import { queryKeys } from "@/lib/react-query/query-keys";

function useInvalidateEnquiryQuotations(
  enquiryId: string,
) {
  const queryClient = useQueryClient();

  return async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: queryKeys.enquiries.quotes(enquiryId),
      }),

      queryClient.invalidateQueries({
        queryKey: queryKeys.enquiries.detail(enquiryId),
        exact: true,
      }),

      queryClient.invalidateQueries({
        queryKey: queryKeys.enquiries.lists(),
      }),
    ]);
  };
}

// ---------------------------------------------
// Fetch quotation list
// ---------------------------------------------

export function useEnquiryQuotations(
  enquiryId: string,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.enquiries.quotes(enquiryId),

    queryFn: () =>
      enquiryQuotationService.list(enquiryId),

    enabled: enabled && Boolean(enquiryId),

    staleTime: 30_000,
  });
}

// ---------------------------------------------
// Fetch individual quotation
// ---------------------------------------------

export function useEnquiryQuotation(
  enquiryId: string,
  quoteId: string,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.enquiries.quote(
      enquiryId,
      quoteId,
    ),

    queryFn: () =>
      enquiryQuotationService.get(
        enquiryId,
        quoteId,
      ),

    enabled:
      enabled &&
      Boolean(enquiryId) &&
      Boolean(quoteId),

    staleTime: 30_000,
  });
}

// ---------------------------------------------
// Create quotation
// ---------------------------------------------

export function useCreateEnquiryQuotation(
  enquiryId: string,
) {
  const invalidate = useInvalidateEnquiryQuotations(
    enquiryId,
  );

  return useMutation({
    mutationFn: (input: CreateEnquiryQuoteInput) =>
      enquiryQuotationService.create(
        enquiryId,
        input,
      ),

    onSuccess: invalidate,
    retry: false,
  });
}

// ---------------------------------------------
// Update draft quotation
// ---------------------------------------------

export function useUpdateEnquiryQuotation(enquiryId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quoteId,
      input,
    }: {
      quoteId: string;
      input: UpdateEnquiryQuoteInput;
    }) =>
      enquiryQuotationService.update(enquiryId, quoteId, input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.enquiries.quotes(enquiryId),
      });
    },
  });
}

// ---------------------------------------------
// Issue quotation
// ---------------------------------------------

export function useIssueEnquiryQuotation(enquiryId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quoteId: string) =>
      enquiryQuotationService.issue(enquiryId, quoteId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.enquiries.quotes(enquiryId),
      });
    },
  });
}

// Update and Issue quotation in one request
export function useUpdateIssueEnquiryQuotation(enquiryId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quoteId,
      input,
    }: {
      quoteId: string;
      input: UpdateEnquiryQuoteInput;
    }) =>
      enquiryQuotationService.updateIssue(enquiryId, quoteId, input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.enquiries.quotes(enquiryId),
      });
    },
  });
}

// ---------------------------------------------
// Send quotation
// ---------------------------------------------

export function useSendEnquiryQuotation(
  enquiryId: string,
  quoteId: string,
) {
  const invalidate = useInvalidateEnquiryQuotations(
    enquiryId,
  );

  return useMutation({
    mutationFn: (
      input: SendEnquiryQuoteInput,
    ) =>
      enquiryQuotationService.send(
        enquiryId,
        quoteId,
        input,
      ),

    onSuccess: invalidate,
  });
}

// ---------------------------------------------
// Accept / decline quotation
// ---------------------------------------------

export function useUpdateEnquiryQuotationStatus(
  enquiryId: string,
  quoteId: string,
) {
  const invalidate = useInvalidateEnquiryQuotations(
    enquiryId,
  );

  return useMutation({
    mutationFn: (
      input: UpdateEnquiryQuoteStatusInput,
    ) =>
      enquiryQuotationService.updateStatus(
        enquiryId,
        quoteId,
        input,
      ),

    onSuccess: invalidate,
  });
}

// ---------------------------------------------
// Void quotation
// ---------------------------------------------

export function useVoidEnquiryQuotation(
  enquiryId: string,
  quoteId: string,
) {
  const invalidate = useInvalidateEnquiryQuotations(
    enquiryId,
  );

  return useMutation({
    mutationFn: (input: VoidEnquiryQuoteInput) =>
      enquiryQuotationService.void(
        enquiryId,
        quoteId,
        input,
      ),

    onSuccess: invalidate,
  });
}
