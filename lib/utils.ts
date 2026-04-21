import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge and de-duplicate Tailwind utility classes.
 * Shadcn-standard helper: clsx handles conditional logic, twMerge resolves conflicts.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
