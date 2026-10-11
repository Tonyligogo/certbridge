import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const expertise = searchParams
      .getAll("expertise")
      .map((value) => value.trim())
      .filter(Boolean);

    if (!expertise.length) {
      return NextResponse.json([]);
    }

    const courses = await prisma.course.findMany({
      where: {
        OR: expertise.flatMap((term) => [
          {
            title: {
              contains: term,
              mode: "insensitive",
            },
          },
          {
            category: {
              is: {
                name: {
                  contains: term,
                  mode: "insensitive",
                },
              },
            },
          },
        ]),
      },

      select: {
        title: true,
        id: true,
        category:{
          select:{
            name: true
          }
        }
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      message: "Available courses fetched successfully",
      data: courses,
      success: true,
    });
  } catch (error) {
    console.error("Failed to fetch available courses:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch available courses",
      },
      { status: 500 }
    );
  }
}