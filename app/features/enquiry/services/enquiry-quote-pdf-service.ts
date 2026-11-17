import { api } from "@/lib/api"; // Adjust to your existing API client import.

export type PdfAccessResult = { url: string; expiresIn: number };

export const enquiryQuotePdfService = {
  async access(
    enquiryId: string,
    quoteId: string,
    download = false,
  ): Promise<PdfAccessResult> {
    const endpoint = `/api/admin/enquiries/${encodeURIComponent(enquiryId)}/quotes/${encodeURIComponent(quoteId)}/pdf${download ? "?download=true" : ""}`;
    const response = await api.get<PdfAccessResult>(endpoint);
    if (!response.data?.url) throw new Error("No PDF access URL returned");
    return response.data;
  },
};
