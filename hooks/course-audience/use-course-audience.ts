import { queryKeys } from "@/lib/react-query/query-keys";
import { courseAudienceService, CreateCourseAudiencePayload } from "@/services/course-audience";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCourseAudiences() {
  return useQuery({
    queryKey: queryKeys.courseAudiences,
    queryFn: courseAudienceService.getCourseAudiences,
  });
}

export function useCreateCourseAudience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseAudiencePayload) =>
      courseAudienceService.createCourseAudience(data),

    onSuccess: () => {
      // Invalidate and automatically refetch the updated audience list
      queryClient.invalidateQueries({ queryKey: queryKeys.courseAudiences });
    },
  });
}