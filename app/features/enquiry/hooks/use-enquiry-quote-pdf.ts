"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { enquiryQuotePdfService } from "../services/enquiry-quote-pdf-service";

export function useEnquiryQuotePdf(enquiryId: string, quoteId: string) {
  const access = useMutation({
    mutationFn: (download: boolean) =>
      enquiryQuotePdfService.access(enquiryId, quoteId, download),
  });

  const viewPdf = () => {
    // Must open during the click event to avoid popup blocking.
    const tab = window.open("", "_blank");
    if (!tab) {
      toast.error("Please allow pop-ups to view the PDF");
      return;
    }
    tab.opener = null;
    tab.document.title = "Opening quotation PDF…";
    void access
      .mutateAsync(false)
      .then(({ url }) => {
        if (!tab.closed) tab.location.replace(url);
      })
      .catch((error) => {
        if (!tab.closed) tab.close();
        toast.error(
          error instanceof Error ? error.message : "Unable to open PDF",
        );
      });
  };

  const downloadPdf = () => {
    // Also open synchronously: cross-origin anchor download attributes are not reliable.
    const tab = window.open("", "_blank");
    if (!tab) {
      toast.error("Please allow pop-ups to download the PDF");
      return;
    }
    tab.opener = null;
    tab.document.title = "Preparing quotation download…";
    void access
      .mutateAsync(true)
      .then(({ url }) => {
        if (!tab.closed) tab.location.replace(url);
      })
      .catch((error) => {
        if (!tab.closed) tab.close();
        toast.error(
          error instanceof Error ? error.message : "Unable to download PDF",
        );
      });
  };

  return { viewPdf, downloadPdf, isLoading: access.isPending };
}
