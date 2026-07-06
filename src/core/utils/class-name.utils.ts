import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges class names using the shadcn-compatible utility pattern.
 *
 * @param inputs - Class values to merge.
 * @returns A normalized class name string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
