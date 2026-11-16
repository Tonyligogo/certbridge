import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const pdfStorageService = {
  async upload(
    pdf: Buffer,
    bucket: string,
    uploadPath: string
  ) {
    const supabase = createSupabaseAdminClient();

    const path = `${uploadPath}.pdf`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, pdf, {
        contentType: "application/pdf",
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(error.message || "Failed to upload quote PDF");
    }

    return {
      path: data.path,
      fullPath: data.fullPath,
    };
  },

  async createSignedUrl(
    bucket: string,
    uploadPath: string,
    download = false,
    expiresIn = 60,
  ) {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(uploadPath, expiresIn, {
        download: download ? true : undefined,
      });

    if (error || !data?.signedUrl) {
      throw new Error(error?.message || "Failed to generate PDF access URL");
    }

    return {
      url: data.signedUrl,
      expiresIn,
    };
  },

  async download(bucket: string, uploadPath: string) {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase.storage.from(bucket).download(uploadPath);

    if (error || !data) {
      throw new Error(error?.message || "Failed to download PDF");
    }

    return data;
  },

  async remove(bucket: string, uploadPath: string) {
    const supabase = createSupabaseAdminClient();

    const { error } = await supabase.storage.from(bucket).remove([uploadPath]);

    if (error) {
      throw new Error(error.message || "Failed to remove PDF");
    }
  },
};
