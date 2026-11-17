import "server-only";

// import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { pdfStorageService } from "@/lib/storage/pdf-storage";

const BUCKET = "quotations";

export const quoteStorageService = {
  upload(quoteId: string, reference: string, pdf: Buffer) {
    const uploadPath = `${quoteId}/${reference}`;
    return pdfStorageService.upload(pdf, BUCKET, uploadPath);
  },

  createSignedUrl( quoteId: string, reference: string, expiresIn = 60, download = false ) {
    const path = `${quoteId}/${reference}`;
    return pdfStorageService.createSignedUrl(
      BUCKET,
      path,
      download,
      expiresIn,
    );
  },

  // async upload(
  //   quoteId: string,
  //   reference: string,
  //   pdf: Buffer,
  // ) {
  //   const supabase = createSupabaseAdminClient();

  //   const path = `${quoteId}/${reference}.pdf`;

  //   const { data, error } = await supabase.storage
  //     .from(BUCKET)
  //     .upload(path, pdf, {
  //       contentType: "application/pdf",
  //       cacheControl: "3600",
  //       upsert: false,
  //     });

  //   if (error) {
  //     throw new Error(
  //       error.message || "Failed to upload quote PDF"
  //     );
  //   }

  //   return {
  //     path: data.path,
  //     fullPath: data.fullPath,
  //   };
  // },

  download(uploadPath: string) {
    return pdfStorageService.download(BUCKET, uploadPath);
  },

  remove(uploadPath: string) {
    return pdfStorageService.remove(BUCKET, uploadPath);
  },
};