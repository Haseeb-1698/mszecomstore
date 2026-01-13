// Supabase-specific type utilities and helpers
import type { Database } from './database.types'

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
  return `PKR ${price.toLocaleString('en-PK')}`
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
