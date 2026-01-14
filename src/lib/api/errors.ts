/**
 * API Error Handling Utilities
 * Provides consistent error handling, response typing, and helper functions
 * for API operations throughout the application.
 */

import type { PostgrestError } from '@supabase/supabase-js';

// ============================================================================
// Error Types
// ============================================================================

export interface ApiError {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
  status?: number;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================================================
// Error Classes
// ============================================================================

export class AppError extends Error {
  code?: string;
  status?: number;
  
  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
  }
}

export class AuthError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

// ============================================================================
// Error Parsing
// ============================================================================

/**
 * Convert a Supabase PostgrestError to our ApiError format
 */
export function parsePostgrestError(error: PostgrestError): ApiError {
  return {
    message: getErrorMessage(error),
    code: error.code,
    details: error.details ?? undefined,
    hint: error.hint ?? undefined,
    status: getStatusFromCode(error.code)
  };
}

/**
 * Convert any error to our ApiError format
 */
export function parseError(error: unknown): ApiError {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      status: error.status
    };
  }

  if (isPostgrestError(error)) {
    return parsePostgrestError(error);
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR'
    };
  }

  return {
    message: typeof error === 'string' ? error : 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR'
  };
}

/**
 * Type guard for PostgrestError
 */
function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
}

/**
 * Get user-friendly error message from PostgrestError
 */
function getErrorMessage(error: PostgrestError): string {
  // Map common Supabase error codes to user-friendly messages
  const errorMessages: Record<string, string> = {
    '23505': 'This record already exists',
    '23503': 'Referenced record not found',
    '22P02': 'Invalid input format',
    '42501': 'You do not have permission to perform this action',
    'PGRST116': 'No rows found',
    'PGRST301': 'Row-level security policy violation'
  };

  return errorMessages[error.code] ?? error.message ?? 'An error occurred';
}

/**
 * Map error codes to HTTP status codes
 */
function getStatusFromCode(code: string): number {
  const statusMap: Record<string, number> = {
    '23505': 409, // Conflict
    '23503': 400, // Bad Request
    '22P02': 400, // Bad Request
    '42501': 403, // Forbidden
    'PGRST116': 404, // Not Found
    'PGRST301': 403 // Forbidden
  };

  return statusMap[code] ?? 500;
}

// ============================================================================
// Result Helpers
// ============================================================================

/**
 * Create a success response
 */
export function success<T>(data: T): ApiResponse<T> {
  return { data, error: null };
}

/**
 * Create an error response
 */
export function failure<T = never>(error: ApiError): ApiResponse<T> {
  return { data: null, error };
}

/**
 * Create an error response from any error type
 */
export function failureFromError<T = never>(error: unknown): ApiResponse<T> {
  return failure(parseError(error));
}

/**
 * Create a paginated success response
 */
export function paginatedSuccess<T>(
  data: T[],
  totalCount: number,
  page: number,
  pageSize: number
): PaginatedResponse<T> {
  return {
    data,
    error: null,
    totalCount,
    page,
    pageSize,
    hasMore: page * pageSize < totalCount
  };
}

// ============================================================================
// Safe Execution Wrapper
// ============================================================================

/**
 * Wrap an async function to catch errors and return ApiResponse
 */
export async function safeAsync<T>(
  fn: () => Promise<T>
): Promise<ApiResponse<T>> {
  try {
    const data = await fn();
    return success(data);
  } catch (error) {
    console.error('API Error:', error);
    return failureFromError(error);
  }
}

/**
 * Wrap a Supabase query to handle errors consistently
 */
export async function handleSupabaseQuery<T>(
  query: Promise<{ data: T | null; error: PostgrestError | null }>
): Promise<ApiResponse<T>> {
  try {
    const { data, error } = await query;
    
    if (error) {
      return failure(parsePostgrestError(error));
    }
    
    if (data === null) {
      return failure({ message: 'No data returned', code: 'NO_DATA' });
    }
    
    return success(data);
  } catch (error) {
    return failureFromError(error);
  }
}

// ============================================================================
// Logging
// ============================================================================

/**
 * Log an API error with context
 */
export function logApiError(
  context: string,
  error: unknown,
  additionalInfo?: Record<string, unknown>
): void {
  const parsedError = parseError(error);
  
  console.error(`[API Error] ${context}:`, {
    ...parsedError,
    ...additionalInfo,
    timestamp: new Date().toISOString()
  });
}

// ============================================================================
// Retry Logic
// ============================================================================

interface RetryOptions {
  maxRetries?: number;
  delay?: number;
  backoff?: number;
  shouldRetry?: (error: unknown) => boolean;
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  delay: 1000,
  backoff: 2,
  shouldRetry: (error) => {
    // Retry on network errors or 5xx server errors
    const parsedError = parseError(error);
    return (parsedError.status ?? 0) >= 500 || parsedError.code === 'NETWORK_ERROR';
  }
};

/**
 * Retry an async function with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: unknown;
  
  for (let attempt = 0; attempt < opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (!opts.shouldRetry(error) || attempt === opts.maxRetries - 1) {
        throw error;
      }
      
      const waitTime = opts.delay * Math.pow(opts.backoff, attempt);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError;
}
