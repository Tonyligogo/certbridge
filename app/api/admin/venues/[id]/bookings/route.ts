import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import { handleAuthError } from "@/app/features/trainers/lib/authError";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  try {
    await requireAdmin();

    const { id } = await params;

    const venueBookings = await prisma.venue.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        bookings: {
          orderBy: {
            createdAt: "desc",
          },
          take: 20,
          include: {
            booking: {
              select: {
                id: true,
                reference: true,
                status: true,
                participantCount: true,
                course: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: venueBookings,
    });
  } catch (error) {
    const authResponse = handleAuthError(error);
    
        if (authResponse) {
          return authResponse;
        }

    console.error(
      "GET /api/venues/[id]/bookings error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch venue bookings",
      },
      { status: 500 }
    );
  }
}