import { PostgrestError } from '@supabase/supabase-js'

// Standard API response wrapper
export interface ApiResponse<T> {
  data: T | null
  error: ApiError | null
  success: boolean
}

// Custom error type
export interface ApiError {
  message: string
  code?: string
  details?: string
  hint?: string
}

// Convert Supabase error to ApiError
export function handleSupabaseError(error: PostgrestError | Error | null): ApiError | null {
  if (!error) return null

  if ('code' in error && 'details' in error) {
    // PostgrestError
    return {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    }
  }

  // Generic Error
  return {
    message: error.message,
  }
}

// Create success response
export function successResponse<T>(data: T): ApiResponse<T> {
  return {
    data,
    error: null,
    success: true,
  }
}

// Create error response
export function errorResponse<T>(error: ApiError): ApiResponse<T> {
  return {
    data: null,
    error,
    success: false,
  }
}

// Generic error handler
export function handleError(error: unknown): ApiError {
  if (error instanceof Error) {
    return handleSupabaseError(error) || { message: error.message }
  }
  
  if (typeof error === 'string') {
    return { message: error }
  }

  return { message: 'An unexpected error occurred' }
}

// Async wrapper with error handling
export async function tryCatch<T>(
  fn: () => Promise<T>
): Promise<ApiResponse<T>> {
  try {
    const data = await fn()
    return successResponse(data)
  } catch (error) {
    return errorResponse(handleError(error))
  }
}
