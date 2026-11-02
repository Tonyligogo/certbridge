import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const BUCKET = "invoices";

export const invoiceStorageService = {
  async upload(
    invoiceId: string,
    reference: string,
    pdf: Buffer,
  ) {
    const supabase = createSupabaseAdminClient();

    const path = `${invoiceId}/${reference}.pdf`;

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(path, pdf, {
        contentType: "application/pdf",
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(
        error.message || "Failed to upload invoice PDF"
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
        error.message || "Failed to download invoice PDF"
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
        error.message || "Failed to remove invoice PDF"
      );
    }
  },
};