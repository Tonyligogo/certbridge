"use client";

import { useCreateCourse } from "@/hooks/course/use-course";
import { CreateCourseInput } from "@/lib/validation/course";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CourseForm } from "@/app/features/courses/CourseForm";

export default function NewCoursePage() {
  const { mutate: createCourse, isPending } = useCreateCourse();
  const router = useRouter();

  const handleCreate = (payload: CreateCourseInput, status: CreateCourseInput["status"]) => {
    createCourse(payload, {
      onSuccess: () => {
        toast.success(
          status === "DRAFT" ? "Draft saved" : "Course published",
          {
            description: `“${payload.title}” has been saved.`,
          }
        );
        router.push("/admin/courses");
      },
      onError: () => {
        toast.error("Error creating course", {
          description: "Something went wrong while saving the course.",
        });
      },
    });
  };

  return (
    <CourseForm
      onSubmit={handleCreate}
      isSubmitting={isPending}
      submitButtonText="Publish Course"
    />
  );
}