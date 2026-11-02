import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import { recordAttendanceSchema } from "@/app/features/attendance/schemas/attendance-schema";

interface RouteContext {
  params: Promise<{
    bookingId: string;
  }>;
}

function getAttendanceSummary(
  participants: {
    attended: boolean;
    attendanceMarkedAt: Date | null;
  }[]
) {
  const total = participants.length;

  const present = participants.filter(
    (p) => p.attendanceMarkedAt && p.attended
  ).length;

  const absent = participants.filter(
    (p) => p.attendanceMarkedAt && !p.attended
  ).length;

  const unmarked = participants.filter(
    (p) => !p.attendanceMarkedAt
  ).length;

  return {
    total,
    present,
    absent,
    unmarked,
    recorded: present + absent,
    complete: total > 0 && unmarked === 0,
    attendanceRate:
      total > 0
        ? Math.round((present / total) * 100)
        : 0,
  };
}

async function getAttendanceRegister(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      reference: true,
      status: true,
      course: {
        select: {
          title: true,
        },
      },
      participants: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          attended: true,
          attendanceMarkedAt: true,
          attendanceMarkedBy: true,
          certificateIssued: true,
        },
        orderBy: [
          { firstName: "asc" },
          { lastName: "asc" },
        ],
      },
    },
  });

  if (!booking) return null;

  return {
    bookingId: booking.id,
    bookingReference: booking.reference,
    bookingStatus: booking.status,
    courseTitle: booking.course.title,
    summary: getAttendanceSummary(booking.participants),
    participants: booking.participants.map((p) => ({
      ...p,
      attendanceStatus: !p.attendanceMarkedAt
        ? "UNMARKED"
        : p.attended
          ? "PRESENT"
          : "ABSENT",
    })),
  };
}

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    await requireAdmin();

    const { bookingId } = await params;

    const register = await getAttendanceRegister(bookingId);

    if (!register) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: register,
    });
  } catch (error) {
    console.error("Get attendance error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load attendance.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const admin = await requireAdmin();
    const { bookingId } = await params;

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON request body.",
        },
        { status: 400 }
      );
    }

    const parsed = recordAttendanceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid attendance data.",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const submitted = parsed.data.participants;
    const participantIds = submitted.map(
      (p) => p.participantId
    );

    if (new Set(participantIds).size !== participantIds.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Duplicate participants are not allowed.",
        },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        reference: true,
        status: true,
        participants: {
          where: {
            id: { in: participantIds },
          },
          select: {
            id: true,
            attended: true,
            attendanceMarkedAt: true,
            certificateIssued: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    if (booking.status === "CANCELLED") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Attendance cannot be recorded for a cancelled booking.",
        },
        { status: 409 }
      );
    }

    if (booking.participants.length !== submitted.length) {
      return NextResponse.json(
        {
          success: false,
          message:
            "One or more participants do not belong to this booking.",
        },
        { status: 400 }
      );
    }

    const existingMap = new Map(
      booking.participants.map((p) => [p.id, p])
    );

    // Only write records that actually changed.
    const changes = submitted.filter((item) => {
      const existing = existingMap.get(item.participantId);

      return (
        !existing?.attendanceMarkedAt ||
        existing.attended !== item.attended
      );
    });

    if (changes.length === 0) {
      const register = await getAttendanceRegister(bookingId);

      return NextResponse.json({
        success: true,
        message: "Attendance is already up to date.",
        data: register,
      });
    }

    // Avoid changing attendance after a certificate has
    // already been issued, without a separate correction flow.
    const certifiedChanges = changes.filter(
      (item) =>
        existingMap.get(item.participantId)?.certificateIssued
    );

    if (certifiedChanges.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Attendance cannot be changed for participants whose certificates have already been issued.",
        },
        { status: 409 }
      );
    }

    const markedAt = new Date();

    await prisma.$transaction(async (tx) => {
      for (const item of changes) {
        await tx.bookingParticipant.update({
          where: {
            id: item.participantId,
          },
          data: {
            attended: item.attended,
            attendanceMarkedAt: markedAt,
            attendanceMarkedBy: admin.user.id,
          },
        });
      }

      const present = changes.filter(
        (p) => p.attended
      ).length;

      const absent = changes.length - present;

      await tx.bookingActivity.create({
        data: {
          bookingId,
          type: "NOTE_ADDED",
          description:
            `Attendance recorded for ${changes.length} participant(s): ` +
            `${present} marked present, ${absent} marked absent.`,
          createdBy: admin.user.id,
          metadata: {
            action: "ATTENDANCE_RECORDED",
            participantIds: changes.map(
              (p) => p.participantId
            ),
            changes: changes.map((p) => ({
              participantId: p.participantId,
              attended: p.attended,
            })),
          },
        },
      });
    });

    const register = await getAttendanceRegister(bookingId);

    return NextResponse.json({
      success: true,
      message: "Attendance recorded successfully.",
      data: register,
    });
  } catch (error) {
    console.error("Record attendance error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to record attendance.",
      },
      { status: 500 }
    );
  }
}
