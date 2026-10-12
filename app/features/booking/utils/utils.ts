export function formatEnum(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

export function formatMoney(
  amount: number,
  currency: string | null
) {
  if(amount === null || amount === undefined) {
    return "Not provided";
  }
  if (!currency) {
    return amount.toLocaleString();
  }

  try {
    return new Intl.NumberFormat(
      "en-KE",
      {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }
    ).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

type DateStyle = "short" | "medium" | "long" | "full";

interface FormatDateOptions {
  dateStyle?: DateStyle;
  timeStyle?: "short" | "medium" | "long" | "full";
  fallback?: string;
}

export function formatDate(
  value: string | Date | null | undefined,
  {
    dateStyle = "medium",
    timeStyle,
    fallback = "Not scheduled",
  }: FormatDateOptions = {}
): string {
  if (value == null || value === "") return fallback;

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return fallback;

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle,
    ...(timeStyle ? { timeStyle } : {}),
  }).format(date);
}