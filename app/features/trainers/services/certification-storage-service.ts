import { createClient } from "@/lib/supabase/client";
import { CertificationResponse } from "./trainer-service";
const BUCKET = "trainer-certifications";

export interface UploadCertificationResult {
  path: string;
  fullPath: string;
}

export const certificationStorageService = {
  async upload(
    trainerId: string,
    file: File
  ): Promise<UploadCertificationResult> {
    const supabase = createClient();

    const extension = file.name.split(".").pop()?.toLowerCase();

    const fileName = `${crypto.randomUUID()}${extension ? `.${extension}` : ""}`;

    const path = `${trainerId}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(
        error.message || "Failed to upload certification"
      );
    }

    return {
      path: data.path,
      fullPath: data.fullPath,
    };
  },

  async replaceFile(
    trainerId: string,
    certificationId: string,
    file: File
  ){
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
      `/api/admin/trainers/${trainerId}/certifications/${certificationId}/file`,
      {
        method: "PUT",
        body: formData,
        credentials: "include",
      }
    );

    const data: CertificationResponse = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to replace certification file"
      );
    }

    return data;
  },

  async remove(path: string) {
    const supabase = createClient();

    const { error } = await supabase.storage
      .from(BUCKET)
      .remove([path]);

    if (error) {
      throw new Error(
        error.message || "Failed to remove certification"
      );
    }
  },
};