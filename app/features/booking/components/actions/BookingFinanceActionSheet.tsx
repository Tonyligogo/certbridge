"use client";

import type {
  AdminBookingDetailsResponse,
} from "../../types/admin-booking";

import {
  BookingFinanceWorkspace,
} from "../admin/BookingFinanceWorkspace";

import {
  ActionSheet,
} from "./ActionSheet";

interface FinanceActionSheetProps {
  booking: AdminBookingDetailsResponse;
  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;
  onClose: () => void;
}

export function BookingFinanceActionSheet({
  booking,
  open,
  onOpenChange,
  onClose
}: FinanceActionSheetProps) {
  return (
    <ActionSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Finance"
      description={`Manage invoices and payments for ${booking.reference}.`}
      className="sm:max-w-2xl"
    >
      <BookingFinanceWorkspace
        booking={booking}
        onClose={onClose}
      />
    </ActionSheet>
  );
}