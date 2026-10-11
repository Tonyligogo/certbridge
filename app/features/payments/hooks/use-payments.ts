import { queryKeys } from "@/lib/react-query/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "../services/use-service";
import { RecordPaymentVariables } from "../types/payments";

export function useInvoicePayments(
  bookingId: string,
  invoiceId: string
) {
  return useQuery({
    queryKey:
      queryKeys.bookings.payments(
        bookingId,
        invoiceId
      ),

    queryFn: () =>
      paymentService.getInvoicePayments(
        bookingId,
        invoiceId
      ),

    enabled:
      Boolean(bookingId) &&
      Boolean(invoiceId),
  });
}

export function useRecordPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      invoiceId,
      data,
    }: RecordPaymentVariables) =>
      paymentService.recordPayment(
        bookingId,
        invoiceId,
        data
      ),

    onSuccess: (
      _response,
      {
        bookingId,
        invoiceId,
      }
    ) => {
      // Payment list changed
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.bookings.payments(
            bookingId,
            invoiceId
          ),
      });

      // Invoice itself may now be PAID
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.bookings.invoice(
            bookingId,
            invoiceId
          ),
      });

      // Booking invoice list may show new balance/status
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.bookings.invoices(
            bookingId
          ),
      });

      // Booking aggregate contains invoices + activities
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.bookings.adminDetail(
            bookingId
          ),
      });

      // Useful once list displays financial/workflow state
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.bookings.adminLists(),
      });
    },
  });
}