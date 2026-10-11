import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import { createVenueSchema, venueStatusSchema } from "@/app/features/venues/lib/venue-schema";
import { handleAuthError } from "@/app/features/trainers/lib/authError";

export async function GET(request: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);

    const page = Math.max(
      Number(searchParams.get("page")) || 1,
      1
    );

    const pageSize = Math.min(
      Math.max(Number(searchParams.get("pageSize")) || 20, 1),
      100
    );

    const search = searchParams.get("search")?.trim();
    const country = searchParams.get("country")?.trim();
    const city = searchParams.get("city")?.trim();
    const status = searchParams.get("status")?.trim();

    const where = {
      ...(status && venueStatusSchema.safeParse(status).success
        ? { status: status as "ACTIVE" | "INACTIVE" }
        : {}),

      ...(country
        ? {
            country: {
              contains: country,
              mode: "insensitive" as const,
            },
          }
        : {}),

      ...(city
        ? {
            city: {
              contains: city,
              mode: "insensitive" as const,
            },
          }
        : {}),

      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                city: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                country: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                address: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    };
    const [venues, total] = await prisma.$transaction([
      prisma.venue.findMany({
        where,
        orderBy: {
          name: "asc",
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          _count: {
            select: {
              bookings: true,
            },
          },
        },
      }),

      prisma.venue.count({
        where,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        venues,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    });
  } catch (error) {
    const authResponse = handleAuthError(error);
    
        if (authResponse) {
          return authResponse;
        }
    console.error("GET /api/venues error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch venues",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();

    const result = createVenueSchema.safeParse(body);

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

    const venue = await prisma.venue.create({
      data: {
        name: data.name,
        description: data.description || undefined,
        country: data.country,
        city: data.city,
        address: data.address || undefined,
        phone: data.phone || undefined,
        email: data.email || undefined,
        website: data.website || undefined,
        capacity: data.capacity ?? undefined,
        notes: data.notes || undefined,
        status: data.status ?? "ACTIVE",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Venue created successfully",
        data: venue,
      },
      { status: 201 }
    );
  } catch (error) {
    const authResponse = handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    console.error("POST /api/venues error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create venue",
      },
      { status: 500 }
    );
  }
}