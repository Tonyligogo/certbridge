import { renderToBuffer } from "@react-pdf/renderer";
import { InvoiceDocument } from "./invoice-document";
import type { InvoicePdfData } from "./invoice-pdf-data";
import { CompanyConfig } from "../../quotes/types/quote";

export async function renderInvoicePdf(
  invoice: InvoicePdfData,
  company: CompanyConfig
): Promise<Buffer> {
  return renderToBuffer(
    <InvoiceDocument invoice={invoice} company={company} />
  );
}