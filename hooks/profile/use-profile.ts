import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateProfilePayload,
  profileService,
  UpdateProfilePayload,
} from "@/services/profile";
import { queryKeys } from "@/lib/react-query/query-keys";

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: profileService.getProfile,
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProfilePayload) =>
      profileService.createProfile(data),

    onSuccess: (response) => {
      queryClient.setQueryData(queryKeys.profile, response);
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfilePayload) =>
      profileService.updateProfile(data),

    onSuccess: (response) => {
      queryClient.setQueryData(queryKeys.profile, response);
    },
  });
}