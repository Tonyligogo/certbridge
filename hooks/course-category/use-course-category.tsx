import { queryKeys } from "@/lib/react-query/query-keys";
import { courseCategoryService, CreateCourseCategoryPayload } from "@/services/course-category";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCourseCategories() {
  return useQuery({
    queryKey: queryKeys.courseCategories,
    queryFn: courseCategoryService.getCourseCategories,
  });
}

export function useCreateCourseCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseCategoryPayload) =>
      courseCategoryService.createCourseCategory(data),

    onSuccess: () => {
      // Invalidate and automatically refetch the updated category list
      queryClient.invalidateQueries({ queryKey: queryKeys.courseCategories });
    },
  });
}