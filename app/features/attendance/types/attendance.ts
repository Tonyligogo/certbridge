export type AttendanceStatus = "PRESENT" | "ABSENT" | "UNMARKED";

export interface AttendanceParticipant {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  attended: boolean;
  attendanceMarkedAt: string | null;
  attendanceMarkedBy: string | null;
  certificateIssued: boolean;
  attendanceStatus: AttendanceStatus;
}

export interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  unmarked: number;
  recorded: number;
  complete: boolean;
  attendanceRate: number;
}

export interface BookingAttendance {
  bookingId: string;
  bookingReference: string;
  bookingStatus: string;
  courseTitle: string;
  summary: AttendanceSummary;
  participants: AttendanceParticipant[];
}

export interface AttendanceRecordInput {
  participantId: string;
  attended: boolean;
}

export interface RecordAttendanceInput {
  participants: AttendanceRecordInput[];
}