import { enquiriesQuerySchema } from "@/app/features/enquiry/lib/validation/enquiry";
import { handleAuthError } from "@/app/features/trainers/lib/authError";
import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const params = Object.fromEntries(
      request.nextUrl.searchParams.entries()
    );

    const parsed = enquiriesQuerySchema.safeParse(params);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid query parameters",
          errors: parsed.error,
        },
        { status: 400 }
      );
    }

    const {
      page,
      limit,
      search,
      status,
      type,
      dateFrom,
      dateTo,
    } = parsed.data;

    // ------------------------------------
    // Shared filters
    // ------------------------------------

    // These filters apply to both the enquiry list
    // and the status counts.
    const baseWhere: Prisma.EnquiryWhereInput = {};

    if (search) {
      baseWhere.OR = [
        {
          reference: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          fullName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          organization: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          courseName: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (type !== "ALL") {
      baseWhere.type = type;
    }

    // ------------------------------------
    // Date filtering (Africa/Nairobi)
    // ------------------------------------

    if (dateFrom || dateTo) {
      baseWhere.createdAt = {
        ...(dateFrom && {
          gte: new Date(`${dateFrom}T00:00:00+03:00`),
        }),

        ...(dateTo && {
          lt: new Date(
            new Date(`${dateTo}T00:00:00+03:00`).getTime() +
              24 * 60 * 60 * 1000
          ),
        }),
      };
    }

    // ------------------------------------
    // Status filtering
    // ------------------------------------

    const where: Prisma.EnquiryWhereInput = {
      ...baseWhere,
    };

    if (status === "PENDING") {
      where.status = {
        in: ["NEW", "CONTACTED", "IN_PROGRESS"],
      };
    } else if (status !== "ALL") {
      where.status = status;
    }

    const skip = (page - 1) * limit;

    // ------------------------------------
    // Fetch enquiries
    // ------------------------------------

    const [enquiries, total, statusCounts] =
      await Promise.all([
        prisma.enquiry.findMany({
          where,
          skip,
          take: limit,

          orderBy: [
            { createdAt: "desc" },
            { id: "desc" },
          ],

          select: {
            id: true,
            reference: true,
            type: true,
            status: true,

            fullName: true,
            email: true,
            phone: true,
            organization: true,

            courseName: true,
            participantCount: true,
            deliveryMode: true,
            preferredDate: true,

            createdAt: true,
            updatedAt: true,
          },
        }),

        // Total matching current filters
        prisma.enquiry.count({
          where,
        }),

        // Counts across all statuses, while still
        // respecting search, type, and date filters.
        prisma.enquiry.groupBy({
          by: ["status"],
          where: baseWhere,
          _count: {
            _all: true,
          },
        }),
      ]);

    // ------------------------------------
    // Status counts
    // ------------------------------------

    const counts = {
      ALL: 0,
      NEW: 0,
      PENDING: 0,
      CONTACTED: 0,
      IN_PROGRESS: 0,
      CONVERTED: 0,
      CLOSED: 0,
    };

    for (const group of statusCounts) {
      const count = group._count._all;

      counts[group.status] = count;
      counts.ALL += count;

      if (
        group.status === "NEW" ||
        group.status === "CONTACTED" ||
        group.status === "IN_PROGRESS"
      ) {
        counts.PENDING += count;
      }
    }

    // ------------------------------------
    // Response
    // ------------------------------------

    return NextResponse.json({
      success: true,
      data: {
        enquiries,
        counts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error(
      "GET /api/admin/enquiries error:",
      error
    );

    const authResponse = handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch enquiries",
      },
      { status: 500 }
    );
  }
}