import { type ClassValue, clsx } from "clsx"

// Fallback for environments where 'tailwind-merge' is not installed.
// This simply returns the clsx result unchanged; install 'tailwind-merge'
// to get advanced Tailwind class merging behavior.
const twMerge = (s: string) => s

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}