export function formatEnum(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

// export function formatMoney(
//   amount: string | null,
//   currency: string
// ) {
//   if (!amount) return "Not provided";

//   const number = Number(amount);

//   if (!Number.isFinite(number)) {
//     return `${currency} ${amount}`;
//   }

//   return new Intl.NumberFormat("en-KE", {
//     style: "currency",
//     currency,
//     maximumFractionDigits: 2,
//   }).format(number);
// }

export function formatMoney(
  amount: number,
  currency: string | null
) {
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

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}