"use client";

import type { BookingWorkflowAction } from "../../types";
import type { AdminBookingDetailsResponse } from "../../types/admin-booking";
import { BookingFinanceWorkspace } from "../admin/BookingFinanceWorkspace";
import { QuotationWorkspace } from "../admin/BookingQuotationWorkspace";
import { BookingTrainerTab } from "../admin/BookingTrainerTab";
import { BookingVenueTab } from "../admin/BookingvenueTab";
import { ScheduleTraining } from "../admin/ScheduleTraining";
import { ActionSheet } from "./ActionSheet";

interface BookingActionSheetProps {
  action: BookingWorkflowAction["type"] | null;

  booking: AdminBookingDetailsResponse;

  onClose: () => void;
}

export function BookingActionSheet({
  action,
  booking,
  onClose,
}: BookingActionSheetProps) {
  if (!action) {
    return null;
  }

  switch (action) {
    case "SOURCE_TRAINER":
      return (
        <ActionSheet
          open
          onOpenChange={(open) => {
            if (!open) {
              onClose();
            }
          }}
          title="Find a trainer"
          description="Source and assign a trainer for this booking."
        >
          <div>
            <BookingTrainerTab booking={booking} onComplete={onClose} />
          </div>
        </ActionSheet>
      );

    case "SOURCE_VENUE":
      return (
        <ActionSheet
          open
          onOpenChange={(open) => {
            if (!open) {
              onClose();
            }
          }}
          title="Find a venue"
          description="Source and assign a venue for this booking."
        >
          <div>
            <BookingVenueTab booking={booking} onComplete={onClose} />
          </div>
        </ActionSheet>
      );

    case "CREATE_QUOTE":
    case "SEND_QUOTE":
    case "REVISE_QUOTE":
    case "UPDATE_QUOTE_STATUS":
      return (
        <ActionSheet
          open
          onOpenChange={(open) => {
            if (!open) {
              onClose();
            }
          }}
          title="Prepare quote"
          description={`Prepare a quote for ${booking.reference}.`}
          className="sm:max-w-2xl"
        >
          <div>
            <QuotationWorkspace
              booking={booking}
              action={action}
              onClose={onClose}
            />
          </div>
        </ActionSheet>
      );

    case "SCHEDULE_TRAINING":
    case "RESCHEDULE_TRAINING":
      return (
        <ActionSheet
          open
          onOpenChange={(open) => {
            if (!open) {
              onClose();
            }
          }}
          title="Schedule training"
          description="Set the confirmed training dates."
        >
          <div>
            <ScheduleTraining booking={booking} onClose={onClose} />
          </div>
        </ActionSheet>
      );

    case "CREATE_INVOICE":
    case "ISSUE_INVOICE":
    case "RECORD_PAYMENT":
      return (
        <ActionSheet
          open
          onOpenChange={(open) => {
            if (!open) {
              onClose();
            }
          }}
          title="Finance"
          description={`Manage invoices and payments for ${booking.reference}.`}
          className="sm:max-w-2xl"
        >
          <BookingFinanceWorkspace
            booking={booking}
            initialMode={action}
            onClose={onClose}
          />
        </ActionSheet>
      );

    case "PREPARE_FOR_TRAINING":
      return (
        <ActionSheet
          open
          onOpenChange={(open) => {
            if (!open) {
              onClose();
            }
          }}
          title="Prepare for training"
          description="Review the booking before training begins."
        >
          <div className="p-6">Training preparation goes here.</div>
        </ActionSheet>
      );

    case "RECORD_ATTENDANCE":
      return (
        <ActionSheet
          open
          onOpenChange={(open) => {
            if (!open) {
              onClose();
            }
          }}
          title="Record attendance"
          description="Record attendance for the training participants."
          className="sm:max-w-2xl"
        >
          <div className="p-6">Attendance recording goes here.</div>
        </ActionSheet>
      );

    case "ISSUE_CERTIFICATES":
      return (
        <ActionSheet
          open
          onOpenChange={(open) => {
            if (!open) {
              onClose();
            }
          }}
          title="Issue certificates"
          description="Issue certificates to participants who attended."
        >
          <div className="p-6">Certificate issuance goes here.</div>
        </ActionSheet>
      );

    case "COLLECT_FEEDBACK":
      return (
        <ActionSheet
          open
          onOpenChange={(open) => {
            if (!open) {
              onClose();
            }
          }}
          title="Collect feedback"
          description="Manage participant feedback for this training."
        >
          <div className="p-6">Feedback collection goes here.</div>
        </ActionSheet>
      );

    case "COMPLETE_BOOKING":
      return (
        <ActionSheet
          open
          onOpenChange={(open) => {
            if (!open) {
              onClose();
            }
          }}
          title="Complete booking"
          description="Review and mark this booking as completed."
        >
          <div className="p-6">Booking completion goes here.</div>
        </ActionSheet>
      );

    default:
      return null;
  }
}
