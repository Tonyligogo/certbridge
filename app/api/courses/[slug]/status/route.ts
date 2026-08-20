import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CourseStatus } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/server/course";
import z from "zod";

const updateCourseStatusSchema = z.object({
  status: z.enum(CourseStatus)
})


interface RouteProps {
  params: Promise<{
    slug: string;
  }>;
}
// I am using slug because that is what is in the route, but it is actually the course Id.
export async function PATCH(
  request: NextRequest,
  { params }: RouteProps
) {
  try {
    requireAdmin();

    const { slug } = await params;
    const id = slug; // Using slug as id because the route is [slug] but it is actually the course Id.
    const body = await request.json();
    const validated = updateCourseStatusSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: z.flattenError(validated.error).fieldErrors,
        },
        {
          status: 400,
        }
      );
    }

    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          message: "Course not found.",
        },
        {
          status: 404,
        }
      );
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        status: validated.data.status,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Course archived successfully.",
      data: updatedCourse,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}