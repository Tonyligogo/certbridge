'use client';

import { queryKeys } from "@/lib/react-query/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invoiceService } from "../services/invoice-services";
import { CreateInvoiceInput, UpdateInvoiceInput } from "../schema/schemas";

export function useBookingInvoices(
  bookingId: string
) {
  return useQuery({
    queryKey:
      queryKeys.bookings.invoices(
        bookingId
      ),

    queryFn: () =>
      invoiceService.getInvoices(
        bookingId
      ),

    enabled: Boolean(bookingId),
  });
}

export function useInvoice(
  bookingId: string,
  invoiceId: string
) {
  return useQuery({
    queryKey:
      queryKeys.bookings.invoice(
        bookingId,
        invoiceId
      ),

    queryFn: () =>
      invoiceService.getInvoice(
        bookingId,
        invoiceId
      ),

    enabled:
      Boolean(bookingId) &&
      Boolean(invoiceId),
  });
}

export function useCreateInvoice() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      data,
    }: {bookingId: string,
      data: CreateInvoiceInput}) =>
      invoiceService.createInvoice(
        bookingId,
        data
      ),

    onSuccess: (
      _response,
      { bookingId }
    ) => {
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.bookings.invoices(
            bookingId
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          queryKeys.bookings.adminDetail(
            bookingId
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          queryKeys.bookings.adminLists(),
      });
    },
  });
}

export function useUpdateInvoice() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      invoiceId,
      data,
    }: {
  bookingId: string;
  invoiceId: string;
  data: UpdateInvoiceInput;
}) =>
      invoiceService.updateInvoice(
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
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.bookings.invoice(
            bookingId,
            invoiceId
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          queryKeys.bookings.invoices(
            bookingId
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          queryKeys.bookings.adminDetail(
            bookingId
          ),
      });
    },
  });
}

export function useIssueInvoice() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      invoiceId,
    }: {
  bookingId: string;
  invoiceId: string;
}) =>
      invoiceService.issueInvoice(
        bookingId,
        invoiceId
      ),

    onSuccess: (
      _response,
      {
        bookingId,
        invoiceId,
      }
    ) => {
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.bookings.invoice(
            bookingId,
            invoiceId
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          queryKeys.bookings.invoices(
            bookingId
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          queryKeys.bookings.adminDetail(
            bookingId
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          queryKeys.bookings.adminLists(),
      });
    },
  });
}

export function useVoidInvoice() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      invoiceId,
    }: {
  bookingId: string;
  invoiceId: string;
}) =>
      invoiceService.voidInvoice(
        bookingId,
        invoiceId
      ),

    onSuccess: (
      _response,
      {
        bookingId,
        invoiceId,
      }
    ) => {
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.bookings.invoice(
            bookingId,
            invoiceId
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          queryKeys.bookings.invoices(
            bookingId
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          queryKeys.bookings.adminDetail(
            bookingId
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          queryKeys.bookings.adminLists(),
      });
    },
  });
}