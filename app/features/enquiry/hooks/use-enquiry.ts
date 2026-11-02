import { useMutation, useQueryClient } from "@tanstack/react-query";

import { enquiryService } from "../services/enquiry";
import type { CreateEnquiryInput } from "../types";
import { queryKeys } from "@/lib/react-query/query-keys";

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