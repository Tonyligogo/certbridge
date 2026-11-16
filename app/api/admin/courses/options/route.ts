
import { getCourseOptions } from "@/app/features/course-catalog/server/get-course-options";
import { requireAdmin } from "@/lib/server/course";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
const querySchema = z.object({
  search: z.string().trim().max(100).default(""),
  limit: z.coerce.number().int().min(1).max(30).default(20),
});

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const params = Object.fromEntries(
      request.nextUrl.searchParams,
    );

    const parsed = querySchema.safeParse(params);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid search parameters.",
          errors: parsed.error,
        },
        { status: 400 },
      );
    }

    const courses = await getCourseOptions(parsed.data);

    return NextResponse.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("Failed to fetch course options:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch courses.",
      },
      { status: 500 },
    );
  }
}
