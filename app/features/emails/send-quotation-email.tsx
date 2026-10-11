import { sendEmail } from "@/lib/email";
import { QuotationEmail } from "./quotation-email";
import { QuotationEmail2 } from "./quotation-email-2";

// Types mirror exactly what your route passes to sendQuotationEmail()
interface QuoteItemEmailData {
  id:        string;
  name:      string;
  quantity:  string;
  unitPrice: string;
  amount:    string;
}

interface QuoteEmailData {
  id:        string;
  reference: string;
  issuedAt:  Date | string | null;
  expiresAt: Date | string | null;
  items:     QuoteItemEmailData[];
}

interface BookingCourseEmailData {
  id:    string;
  title: string;
  slug:  string;
}

interface BookingEmailData {
  id:                  string;
  reference:           string;
  organizationName:    string | null;
  contactName:         string;
  contactEmail:        string;
  contactPhone:        string;
  deliveryMode:        string;
  participantCount:    number;
  currency:            string;
  preferredStartDate:  Date | string | null;
  preferredEndDate:    Date | string | null;
  scheduledStartDate:  Date | string | null;
  scheduledEndDate:    Date | string | null;
  locationAddress:     string | null;
  locationCity:        string | null;
  locationCountry:     string | null;
  locationNotes:       string | null;
  specialRequirements: string | null;
  course:              BookingCourseEmailData;
}

export interface SendQuotationEmailData {
  quote:   QuoteEmailData;
  booking: BookingEmailData;
}

export async function sendQuotationEmail({
  quote,
  booking,
}: SendQuotationEmailData): Promise<void> {

  const total = quote.items
    .reduce((sum, item) => sum + parseFloat(item.amount), 0)
    .toLocaleString("en-KE", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

  await sendEmail({
    to:      booking.contactEmail,
    subject: `Quotation ${quote.reference} — ${booking.course.title} · ${booking.currency} ${total}`,
    from:    "bookings",
    react:   QuotationEmail2({ quote, booking }),
  });
}