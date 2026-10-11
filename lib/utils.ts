import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const TAX_RATE = 0.16;

export function generateReference(prefix:string) {
  const timestamp = Date.now().toString().slice(-6);

  const random = Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase();

  return `${prefix}-${timestamp}-${random}`;
}