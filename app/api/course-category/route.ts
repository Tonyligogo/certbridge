import { getServerSession } from "@/lib/get-server-session";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import { createCategorySchema } from "@/lib/validation/course";
import { NextRequest, NextResponse } from "next/server";
import z, { ZodError } from "zod";

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 },
      );
    }

    const courseCategories = await prisma.courseCategory.findMany();

    return NextResponse.json({
      success: true,
      data: courseCategories,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAdmin()

    const body = createCategorySchema.parse(await request.json());

    const courseCategory = await prisma.courseCategory.create({
      data: {
        name: body.name,
        slug:body.slug,
        isActive:body.isActive,
        description:body.description,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully.",
        data: courseCategory,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: z.flattenError(error).fieldErrors,
        },
        {
          status: 400,
        },
      );
    }
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}