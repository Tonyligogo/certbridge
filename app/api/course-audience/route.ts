import { getServerSession } from "@/lib/get-server-session";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import { createAudienceSchema } from "@/lib/validation/course";
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

    const courseAudiences = await prisma.courseAudience.findMany();

    return NextResponse.json({
      success: true,
      data: courseAudiences,
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

    const body = createAudienceSchema.parse(await request.json());

    const courseAudience = await prisma.courseAudience.create({
      data: {
        name: body.name,
        slug:body.slug,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Audience created successfully.",
        data: courseAudience,
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