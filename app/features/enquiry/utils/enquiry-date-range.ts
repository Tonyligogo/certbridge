import type { EnquiryDatePreset } from "../types";

const TIME_ZONE = "Africa/Nairobi";

function getKenyaToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function addDays(date: string, days: number): string {
  const value = new Date(`${date}T12:00:00.000Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

export function getEnquiryDateRange(
  preset: EnquiryDatePreset
): {
  dateFrom?: string;
  dateTo?: string;
} {
  const today = getKenyaToday();
  const [year, month] = today.split("-").map(Number);

  switch (preset) {
    case "TODAY":
      return {
        dateFrom: today,
        dateTo: today,
      };

    case "LAST_7_DAYS":
      return {
        dateFrom: addDays(today, -6),
        dateTo: today,
      };

    case "LAST_30_DAYS":
      return {
        dateFrom: addDays(today, -29),
        dateTo: today,
      };

    case "THIS_MONTH":
      return {
        dateFrom: `${year}-${String(month).padStart(2, "0")}-01`,
        dateTo: today,
      };

    case "LAST_MONTH": {
      const firstDay = new Date(Date.UTC(year, month - 2, 1));
      const lastDay = new Date(Date.UTC(year, month - 1, 0));

      return {
        dateFrom: firstDay.toISOString().slice(0, 10),
        dateTo: lastDay.toISOString().slice(0, 10),
      };
    }

    default:
      return {};
  }
}