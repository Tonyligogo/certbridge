import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const BUCKET = "quotations";

export const quoteStorageService = {
  async upload(
    quoteId: string,
    reference: string,
    pdf: Buffer,
  ) {
    const supabase = createSupabaseAdminClient();

    const path = `${quoteId}/${reference}.pdf`;

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(path, pdf, {
        contentType: "application/pdf",
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(
        error.message || "Failed to upload quote PDF"
      );
    }

    return {
      path: data.path,
      fullPath: data.fullPath,
    };
  },

  async download(path: string) {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .download(path);

    if (error) {
      throw new Error(
        error.message || "Failed to download quote PDF"
      );
    }

    return data;
  },

  async remove(path: string) {
    const supabase = createSupabaseAdminClient();

    const { error } = await supabase.storage
      .from(BUCKET)
      .remove([path]);

    if (error) {
      throw new Error(
        error.message || "Failed to remove quote PDF"
      );
    }
  },
};