import { Profile } from "@/generated/prisma/client";
import { api } from "@/lib/api";

export interface CreateProfilePayload {
  type: "INDIVIDUAL" | "ORGANIZATION" | "GROUP";
  displayName: string;
  phone?: string;
  country?: string;
  city?: string;
  website?: string;
  logoUrl?: string;
  kraPin?: string;
  address?: string;
}

export type UpdateProfilePayload = Partial<CreateProfilePayload>;

export const profileService = {
  async getProfile() {
    const response = await api.get<Profile>("/api/profile");
  return response.data;
  },

  createProfile(data: CreateProfilePayload) {
    return api.post<Profile>("/api/profile", data);
  },

  updateProfile(data: UpdateProfilePayload) {
    return api.patch<Profile>("/api/profile", data);
  },
};