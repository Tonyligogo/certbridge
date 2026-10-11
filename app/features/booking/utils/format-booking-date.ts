export function formatDateRange(
  startDate: string | null,
  endDate: string | null
) {
  if (!startDate && !endDate) {
    return "Not specified";
  }

  const fullFormatter =
    new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });

  const shortFormatter =
    new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    });

  if (startDate && !endDate) {
    return fullFormatter.format(
      new Date(startDate)
    );
  }

  if (!startDate && endDate) {
    return fullFormatter.format(
      new Date(endDate)
    );
  }

  const start = new Date(startDate!);
  const end = new Date(endDate!);

  const sameDay =
    start.getUTCFullYear() ===
      end.getUTCFullYear() &&
    start.getUTCMonth() ===
      end.getUTCMonth() &&
    start.getUTCDate() ===
      end.getUTCDate();

  if (sameDay) {
    return fullFormatter.format(start);
  }

  const sameYear =
    start.getUTCFullYear() ===
    end.getUTCFullYear();

  if (sameYear) {
    return `${shortFormatter.format(
      start
    )} – ${fullFormatter.format(end)}`;
  }

  return `${fullFormatter.format(
    start
  )} – ${fullFormatter.format(end)}`;
}