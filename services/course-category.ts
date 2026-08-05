import { CourseCategory } from "@/generated/prisma/client";
import { api } from "@/lib/api";
import { CreateCategoryInput } from "@/lib/validation/course";

export type CreateCourseCategoryPayload = CreateCategoryInput;

export const courseCategoryService = {
    async createCourseCategory(data: CreateCourseCategoryPayload) {
        const response = await api.post<CourseCategory>("/api/course-category", data);
        return response.data;
      },

      async getCourseCategories() {
          const response = await api.get<CourseCategory[]>("/api/course-category");
          return response.data;
        },
}