import { getCourseBySlug } from "@/lib/server/course";
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

    console.log('slug from server',slug)

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