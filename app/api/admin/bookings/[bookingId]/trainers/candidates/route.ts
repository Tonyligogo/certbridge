// route for sourcing a trainer

import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import { handleAuthError } from "@/app/features/trainers/lib/authError";

interface RouteContext {
  params: Promise<{
    bookingId: string;
  }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await requireAdmin();

    const { bookingId } = await context.params;

    const search = request.nextUrl.searchParams
      .get("search")
      ?.trim() ?? "";

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      select: {
        id: true,
        courseId: true,
        deliveryMode: true,
        locationCountry: true,
        locationCity: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found",
        },
        { status: 404 }
      );
    }

    const where: Prisma.TrainerWhereInput = {
      status: "ACTIVE",

      courses: {
        some: {
          courseId: booking.courseId,
        },
      },
    };

    if (search) {
      where.OR = [
        {
          firstName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          lastName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          expertise: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          primaryCity: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          primaryCountry: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    const trainers = await prisma.trainer.findMany({
      where,
      include: {
        courses: {
          where: {
            courseId: booking.courseId,
          },
          include: {
            course: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        },

        certifications: {
          where: {
            status: "VALID",
          },
          select: {
            id: true,
            name: true,
            issuedBy: true,
            expiresAt: true,
          },
        },

        bookings: {
          where: {
            bookingId,
          },
          select: {
            id: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Trainer candidates fetched successfully",
      data: trainers,
    });
  } catch (error) {
    const authResponse = handleAuthError(error);
            
                if (authResponse) {
                  return authResponse;
                }

    console.error(
      "GET trainer candidates error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch trainer candidates",
      },
      { status: 500 }
    );
  }
}