import { CourseStatus } from "@/app/features/course-catalog/types/catalogue";
import { queryKeys } from "@/lib/react-query/query-keys";
import { courseService, CreateCoursePayload, UpdateCoursePayload } from "@/services/course";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCourses() {
  return useQuery({
    queryKey: queryKeys.courses,
    queryFn: courseService.getCourses,
  });
}

// available courses for trainers to link
export function useAvailableCourses(expertise: string[], currentStep: boolean) {
  return useQuery({
    queryKey: ["available-courses", expertise],
    queryFn: () => courseService.getAvailableCourses(expertise),
    enabled: expertise.length > 0 && currentStep === true,
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

export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCoursePayload;
    }) => courseService.updateCourse(id, data),

    onSuccess: (updatedCourse) => {
      // Update the individual course cache
      queryClient.setQueryData(
        ["course", updatedCourse?.id],
        updatedCourse
      );

      // Invalidate course lists so they refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses,
      });
    },
  });
}

export function useGetCourseBySlug(slug: string) {
  return useQuery({
    queryKey: ["course", slug],

    queryFn: () => courseService.getCourseBySlug(slug),

    enabled: !!slug,
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => courseService.deleteCourse(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses,
      });
    },
  });
}

export function useUpdateCourseStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: CourseStatus;
    }) => courseService.updateCourseStatus(id, status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses,
      });
    },
  });
}