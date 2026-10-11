import { Course as UpdateCourse } from "@/app/features/course-catalog/types/catalogue";
import { Course, CourseStatus } from "@/generated/prisma/client";
import { api } from "@/lib/api";
import { CreateCourseInput } from "@/lib/validation/course";

export type CreateCoursePayload = CreateCourseInput;

export type UpdateCoursePayload = Partial<CreateCoursePayload>;

export interface AvailableCourse {
  id: string;
  title: string;
  category: {
    name: string;
  };
}

export const courseService = {
  async getCourses() {
    const response = await api.get<Course[]>("/api/admin/trainers/available-courses");
    return response.data;
  },

  // fetch available courses for trainers to link
async getAvailableCourses(expertise: string[]):Promise<AvailableCourse[]> {
  const params = new URLSearchParams();

  expertise.forEach((item) => {
    params.append("expertise", item);
  });

  const queryString = params.toString();

    const response = await api.get<AvailableCourse[]>(
    `/api/admin/trainers/available-courses?${queryString}`
  );

  return response.data || [];
},

  async getCourse(id: string) {
    const response = await api.get<Course>(`/api/courses/${id}`);
    return response.data;
  },


  async getCourseBySlug(slug: string) {
    const response = await api.get<UpdateCourse>(`/api/courses/${slug}`);
    return response.data;
  },

  async createCourse(data: CreateCoursePayload) {
    const response = await api.post<Course>("/api/courses", data);
    return response.data;
  },

  async updateCourse(id: string, data: UpdateCoursePayload) {
    const response = await api.patch<Course>(`/api/courses`, data);
    return response.data;
  },

  async deleteCourse(id: string) {
  const response = await api.delete<{
    success: boolean;
    message: string;
  }>(`/api/courses/${id}`);

  return response.data;
},

async updateCourseStatus(id: string, status: CourseStatus) {
  const response = await api.patch<{
    success: boolean;
    message: string;
  }>(`/api/courses/${id}/status`, {
    status,
  });

  return response.data;
}
};