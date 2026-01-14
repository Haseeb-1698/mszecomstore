// Supabase-specific type utilities and helpers
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for merging Tailwind CSS classes
 * Uses clsx for conditional classes and tailwind-merge to handle conflicts
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Helper to convert database dates to Date objects
export function dbDateToDate(dbDate: string): Date {
  return new Date(dbDate)
}

// Helper to convert Date to database format
export function dateToDbDate(date: Date): string {
  return date.toISOString()
}

// Calculate days remaining until expiry
export function calculateDaysRemaining(expiresAt: string): number {
  const now = new Date()
  const expiry = new Date(expiresAt)
  const diff = expiry.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// Check if subscription is expired
export function isSubscriptionExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date()
}

// Format price for display
export function formatPrice(price: number): string {
  return `Rs ${price.toLocaleString('en-PK')}`
}

// Format price with decimals
export function formatPriceWithDecimals(price: number): string {
  return `Rs ${price.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// Format date for display (short format: Jan 1, 2024)
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Format date with time (Jan 1, 2024, 12:00 PM)
export function formatDateTime(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Type guard for checking if error is from Supabase
export function isSupabaseError(error: unknown): error is { message: string; code: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'code' in error
  )
}
