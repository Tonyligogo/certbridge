import { CourseAudience } from "@/generated/prisma/client";
import { api } from "@/lib/api";
import { CreateAudienceInput } from "@/lib/validation/course";

export type CreateCourseAudiencePayload = CreateAudienceInput;

export const courseAudienceService = {
    async createCourseAudience(data: CreateCourseAudiencePayload) {
        const response = await api.post<CourseAudience>("/api/course-audience", data);
        return response.data;
      },

      async getCourseAudiences() {
          const response = await api.get<CourseAudience[]>("/api/course-audience");
          return response.data;
        },
}