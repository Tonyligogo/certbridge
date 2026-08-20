import prisma from "@/lib/prisma";
import { getCourseBySlug, requireAdmin } from "@/lib/server/course";
import { NextRequest, NextResponse } from "next/server";

interface GetBySlugProps {
  params: Promise<{
    slug: string;
  }>;
}

// get by slug
export async function GET(
  request: NextRequest,
  { params }: GetBySlugProps
) {
  try {
    const { slug } = await params;

    const course = await getCourseBySlug(slug);

    if (!course) {
      return NextResponse.json(
        {
          success:false,
          error: "Course not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
         {
        success: true,
        message: "Course fetched successfully.",
        data: course,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

interface DeleteCourseProps {
  params: Promise<{
    slug: string;
  }>;
}
// I am passing the course Id as string because I have [slug] in the route, but it is actually the course Id.
export async function DELETE(
  request: NextRequest,
  { params }: DeleteCourseProps
) {
  try {
    requireAdmin();

    const { slug } = await params;
    const id = slug; // the slug is actually course ID

    const existing = await prisma.course.findUnique({
      where: {
        id,
      },
    });

    if (!existing) {
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

    await prisma.course.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Course deleted successfully.",
      },
      {
        status: 200,
      }
    );
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