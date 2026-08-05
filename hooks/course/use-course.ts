import { queryKeys } from "@/lib/react-query/query-keys";
import { courseService, CreateCoursePayload } from "@/services/course";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCourses() {
  return useQuery({
    queryKey: queryKeys.courses,
    queryFn: courseService.getCourses,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCoursePayload) =>
      courseService.createCourse(data),

    onSuccess: (response) => {
      queryClient.setQueryData(queryKeys.courses, response);
    },
  });
}