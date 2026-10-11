import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { handleAuthError } from "@/app/features/trainers/lib/authError";
import { requireAdmin } from "@/lib/server/course";
import { updateVenueSchema } from "@/app/features/venues/lib/venue-schema";

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

    const venue = await prisma.venue.findUnique({
      where: { id },
      include: {
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

        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    if (!venue) {
      return NextResponse.json(
        {
          success: false,
          message: "Venue not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: venue,
    });
  } catch (error) {
    const authResponse = handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    console.error("GET /api/venues/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch venue",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    await requireAdmin();

    const { id } = await params;

    const existingVenue = await prisma.venue.findUnique({
      where: { id },
    });

    if (!existingVenue) {
      return NextResponse.json(
        {
          success: false,
          message: "Venue not found",
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    const result = updateVenueSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = result.data;

    const venue = await prisma.venue.update({
      where: { id },
      data: {
        ...(data.name !== undefined && {
          name: data.name,
        }),

        ...(data.description !== undefined && {
          description: data.description || null,
        }),

        ...(data.country !== undefined && {
          country: data.country,
        }),

        ...(data.city !== undefined && {
          city: data.city,
        }),

        ...(data.address !== undefined && {
          address: data.address || null,
        }),

        ...(data.phone !== undefined && {
          phone: data.phone || null,
        }),

        ...(data.email !== undefined && {
          email: data.email || null,
        }),

        ...(data.website !== undefined && {
          website: data.website || null,
        }),

        ...(data.capacity !== undefined && {
          capacity: data.capacity,
        }),

        ...(data.notes !== undefined && {
          notes: data.notes || null,
        }),

        ...(data.status !== undefined && {
          status: data.status,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Venue updated successfully",
      data: venue,
    });
  } catch (error) {
    const authResponse = handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    console.error("PATCH /api/venues/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update venue",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  try {
    await requireAdmin();

    const { id } = await params;

    const venue = await prisma.venue.findUnique({
      where: { id },
    });

    if (!venue) {
      return NextResponse.json(
        {
          success: false,
          message: "Venue not found",
        },
        { status: 404 }
      );
    }

    const updatedVenue = await prisma.venue.update({
      where: { id },
      data: {
        status: "INACTIVE",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Venue deactivated successfully",
      data: updatedVenue,
    });
  } catch (error) {
    const authResponse = handleAuthError(error);
    
        if (authResponse) {
          return authResponse;
        }

    console.error("DELETE /api/venues/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to deactivate venue",
      },
      { status: 500 }
    );
  }
}