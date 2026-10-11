"use client";
import { getBookingWorkflow } from "@/app/features/booking/booking";
import { BookingActionSheet } from "@/app/features/booking/components/actions/BookingActionSheet";
import { BookingFinanceActionSheet } from "@/app/features/booking/components/actions/BookingFinanceActionSheet";
import { TrainerDetailsSheet } from "@/app/features/booking/components/admin/TrainerDetailsSheet";
import { VenueDetailsSheet } from "@/app/features/booking/components/admin/VenueDetailsSheet";
import { ActivityCard } from "@/app/features/booking/components/booking-details/ActivityCard";
import { BookingDetailsError } from "@/app/features/booking/components/booking-details/BookingDetailsError";
import { BookingDetailsSkeleton } from "@/app/features/booking/components/booking-details/BookingDetailsSkeleton";
import { BookingHeader } from "@/app/features/booking/components/booking-details/BookingHeader";
import { BookingProgress } from "@/app/features/booking/components/booking-details/BookingProgress";
import { ClientCard } from "@/app/features/booking/components/booking-details/ClientCard";
import { CommercialCard } from "@/app/features/booking/components/booking-details/CommercialCard";
import { FinanceCard } from "@/app/features/booking/components/booking-details/FinanceCard";
import { NextActionsCard } from "@/app/features/booking/components/booking-details/NextActionsCard";
import { ParticipantsCard } from "@/app/features/booking/components/booking-details/ParticipantsCard";
import { ResourcesCard } from "@/app/features/booking/components/booking-details/ResourcesCard";
import { TrainingRequestCard } from "@/app/features/booking/components/booking-details/TrainingRequestCard";
import { useAdminBookingDetailsResponse } from "@/app/features/booking/hooks/use-booking";
import { BookingWorkflowAction } from "@/app/features/booking/types";
import { useParams } from "next/navigation";
import { useState } from "react";

const SingleBooking = () => {
  const params = useParams();
  const bookingId = params.bookingId as string;
  const [activeAction, setActiveAction] = useState< BookingWorkflowAction["type"] | null  >(null);
  const [financeOpen, setFinanceOpen] = useState(false);
  const [selectedTrainerAssignmentId, setSelectedTrainerAssignmentId] = useState<string | null>(null);
  const [selectedVenueAssignmentId, setSelectedVenueAssignmentId] = useState<string | null>(null);

  const { data, isPending, isError } = useAdminBookingDetailsResponse(bookingId);

  if (isPending) {
    return <BookingDetailsSkeleton />;
  }

  if (isError || !data?.data) {
    return <BookingDetailsError />;
  }

  const booking = data?.data;

  const workflow = getBookingWorkflow(booking);

  function handleBookingAction(action: BookingWorkflowAction) {
    if (action.kind !== "ACTION") {
      return;
    }

    setActiveAction(action.type);
  }

  const selectedTrainerAssignment =
  booking.trainers.find(
    ({ id }) =>
      id === selectedTrainerAssignmentId
  ) ?? null;

const selectedVenueAssignment =
  booking.venues.find(
    ({ id }) =>
      id === selectedVenueAssignmentId
  ) ?? null;

  return (
    <>
      <div className="space-y-6">
        <BookingHeader booking={booking} />
        <BookingProgress booking={booking} workflow={workflow} />
        {/* Workflow progress comes here */}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <main className="min-w-0 space-y-6">
            {/* Client */}
            <ClientCard booking={booking} />
            {/* Training request */}
            <TrainingRequestCard booking={booking} />
            {/* Participants */}
            <ParticipantsCard
              booking={booking}
              workflow={workflow}
              onManageParticipants={() => {
                // Open participant management
              }}
              onRecordAttendance={() => {
                // Open attendance sheet
              }}
              onIssueCertificates={() => {
                // Certificate workflow
              }}
              onCollectFeedback={() => {
                // Feedback workflow
              }}
              onViewParticipant={(participantId) => {
                // Open participant details
              }}
            />
            {/* Commercial */}
            <CommercialCard
              booking={booking}
              workflow={workflow}
              onCreateQuote={() => setActiveAction("CREATE_QUOTE")}
              onCreateInvoice={() => setActiveAction("CREATE_INVOICE")}
              onViewQuote={() => {
                setActiveAction("UPDATE_QUOTE_STATUS");
              }}
              onViewInvoice={(invoiceId) => {
                // Open invoice
              }}
              onRecordPayment={(invoiceId) => {
                // Open record-payment dialog
              }}
            />
            {/* Activity */}
            <ActivityCard
              booking={booking}
              onViewAll={() => {
                // Later:
                // open activity history sheet
              }}
            />
          </main>

          <aside className="space-y-6">
            {/* Next actions */}
            <NextActionsCard
              workflow={workflow}
              onAction={handleBookingAction}
            />
            {/* Resources */}
            <ResourcesCard
              booking={booking}
              workflow={workflow}
              onSourceTrainer={() => setActiveAction("SOURCE_TRAINER")}
              onSourceVenue={() => setActiveAction("SOURCE_VENUE")}
              onViewTrainer={(assignmentId) => {
                setSelectedTrainerAssignmentId(
                  assignmentId
                );
              }}
              onViewVenue={(assignmentId) => {
                setSelectedVenueAssignmentId(
                  assignmentId
                );
              }}
            />
            {/* Invoices and payments */}
            <FinanceCard
              financial={workflow.financial}
              onOpenFinance={() =>
                setFinanceOpen(true)
              }
            />
          </aside>
        </div>
      </div>
      <BookingActionSheet
        action={activeAction}
        booking={booking}
        onClose={() => setActiveAction(null)}
      />

      <BookingFinanceActionSheet
        booking={booking}
        open={financeOpen}
        onOpenChange={setFinanceOpen}
        onClose={()=>setFinanceOpen(false)}
      />

      <TrainerDetailsSheet
        assignment={selectedTrainerAssignment}
        open={Boolean(selectedTrainerAssignment)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTrainerAssignmentId(null);
          }
        }}
      />

      <VenueDetailsSheet
        assignment={selectedVenueAssignment}
        open={Boolean(selectedVenueAssignment)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedVenueAssignmentId(null);
          }
        }}
        />
    </>
  );
};

export default SingleBooking;
