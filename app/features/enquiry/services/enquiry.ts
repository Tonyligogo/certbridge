import { api } from "@/lib/api";
import type { CreatedEnquiry, CreateEnquiryInput } from "../types";

export const enquiryService = {
  async createEnquiry(data: CreateEnquiryInput) {
    return api.post<CreatedEnquiry>("/api/enquiries", data);
  },
};