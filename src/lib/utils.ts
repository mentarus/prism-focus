import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ensureHttps(url: string): string {
  if (!url) return url
  // If already has protocol, return as-is
  if (url.match(/^https?:\/\//i)) return url
  // Add https:// prefix
  return `https://${url}`
}
