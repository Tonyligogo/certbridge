
"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  ClipboardCheck,
  Loader2,
  Users,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useBookingAttendance, useRecordAttendance } from "../hooks/use-attendance";
import type { AttendanceStatus } from "../types/attendance";

interface AttendanceRegisterProps {
  bookingId: string;
}

export function AttendanceRegister({
  bookingId,
}: AttendanceRegisterProps) {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useBookingAttendance(bookingId);

  const recordAttendance = useRecordAttendance();

  const [changes, setChanges] = useState<
  Record<string, AttendanceStatus>
>({});

 const pendingChanges = useMemo(() => {
  if (!data) return [];

  return data.participants
    .filter((participant) => {
      const selected = changes[participant.id];

      return (
        selected !== undefined &&
        selected !== "UNMARKED" &&
        selected !== participant.attendanceStatus
      );
    })
    .map((participant) => ({
      participantId: participant.id,
      attended: changes[participant.id] === "PRESENT",
    }));
}, [data, changes]);

  const summary = useMemo(() => {
  if (!data) {
    return {
      present: 0,
      absent: 0,
      unmarked: 0,
    };
  }

  const statuses = data.participants.map(
    (participant) =>
      changes[participant.id] ??
      participant.attendanceStatus
  );

  return {
    present: statuses.filter(
      (status) => status === "PRESENT"
    ).length,

    absent: statuses.filter(
      (status) => status === "ABSENT"
    ).length,

    unmarked: statuses.filter(
      (status) => status === "UNMARKED"
    ).length,
  };
}, [data, changes]);

  const handleStatusChange = (
  participantId: string,
  status: AttendanceStatus
) => {
  setChanges((previous) => ({
    ...previous,
    [participantId]: status,
  }));
};

  const handleSave = async () => {
  if (pendingChanges.length === 0) return;

  try {
    await recordAttendance.mutateAsync({
      bookingId,
      data: {
        participants: pendingChanges,
      },
    });

    setChanges({});

    toast.success("Attendance saved successfully.");
  } catch (error) {
    const apiError = error as { message?: string };

    toast.error(
      apiError.message ?? "Failed to save attendance."
    );
  }
};

  if (isLoading) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-3 rounded-xl border p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Unable to load attendance.
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const total = data.participants.length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">Attendance</h3>
          <p className="text-sm text-muted-foreground">
            Record overall attendance for this training.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ClipboardCheck className="size-4" />
          {summary.unmarked === 0 && total > 0
            ? "Complete"
            : "In progress"}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <SummaryCard
          label="Present"
          value={summary.present}
          icon={<CheckCircle2 className="size-4" />}
        />
        <SummaryCard
          label="Absent"
          value={summary.absent}
          icon={<XCircle className="size-4" />}
        />
        <SummaryCard
          label="Unmarked"
          value={summary.unmarked}
          icon={<Users className="size-4" />}
        />
      </div>

      <div className="overflow-hidden rounded-xl border">
        <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
          <h4 className="text-sm font-semibold">
            Participants
          </h4>
          <span className="text-xs text-muted-foreground">
            {total} registered
          </span>
        </div>

        {total === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No participants have been added to this booking.
          </div>
        ) : (
          <div className="divide-y">
            {data.participants.map((participant) => {
              const status =
  changes[participant.id] ??
  participant.attendanceStatus;

              const locked = participant.certificateIssued;

              return (
                <div
                  key={participant.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      {participant.firstName}{" "}
                      {participant.lastName}
                    </p>
                    {participant.email && (
                      <p className="truncate text-xs text-muted-foreground">
                        {participant.email}
                      </p>
                    )}
                    {locked && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Certificate issued · Attendance locked
                      </p>
                    )}
                  </div>

                  <Select
                    value={status}
                    onValueChange={(value) =>
                      handleStatusChange(
                        participant.id,
                        value as AttendanceStatus
                      )
                    }
                    disabled={
                      locked ||
                      recordAttendance.isPending ||
                      data.bookingStatus === "CANCELLED"
                    }
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UNMARKED" disabled>
                        Not marked
                      </SelectItem>
                      <SelectItem value="PRESENT">
                        Present
                      </SelectItem>
                      <SelectItem value="ABSENT">
                        Absent
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
       <p className="text-xs text-muted-foreground">
  {pendingChanges.length > 0
    ? `${pendingChanges.length} unsaved change(s)`
    : "All changes saved"}
</p>

<Button
  onClick={handleSave}
  disabled={
    pendingChanges.length === 0 ||
    recordAttendance.isPending ||
    data.bookingStatus === "CANCELLED"
  }
>
  Save Attendance
</Button>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border p-3">
      <div className="mb-2 flex items-center justify-between text-muted-foreground">
        <span className="text-xs">{label}</span>
        {icon}
      </div>
      <p className="text-2xl font-semibold tabular-nums">
        {value}
      </p>
    </div>
  );
}
