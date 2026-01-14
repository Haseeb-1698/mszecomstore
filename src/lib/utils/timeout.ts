/**
 * Timeout utilities for database queries and async operations.
 * 
 * These utilities prevent infinite loading states by adding timeouts
 * to Supabase queries and other async operations.
 */

/**
 * Default timeout in milliseconds for database queries
 */
export const DEFAULT_QUERY_TIMEOUT = 10000; // 10 seconds

/**
 * Short timeout for quick lookups (e.g., auth checks)
 */
export const SHORT_TIMEOUT = 5000; // 5 seconds

/**
 * Long timeout for complex operations
 */
export const LONG_TIMEOUT = 30000; // 30 seconds

/**
 * Error thrown when an operation times out
 */
export class TimeoutError extends Error {
  constructor(message = 'Operation timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
}

/**
 * Wraps a promise with a timeout. If the promise doesn't resolve
 * within the specified time, it rejects with a TimeoutError.
 * 
 * @param promise - The promise to wrap
 * @param ms - Timeout in milliseconds
 * @param errorMessage - Custom error message for timeout
 * @returns The result of the promise if it resolves in time
 * 
 * @example
 * const result = await withTimeout(
 *   supabase.from('users').select('*'),
 *   5000,
 *   'Failed to fetch users'
 * );
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number = DEFAULT_QUERY_TIMEOUT,
  errorMessage?: string
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new TimeoutError(errorMessage || `Operation timed out after ${ms}ms`));
    }, ms);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId!);
    return result;
  } catch (error) {
    clearTimeout(timeoutId!);
    throw error;
  }
}

/**
 * Wraps a promise with a timeout, but returns a default value on timeout
 * instead of throwing an error. Useful for non-critical operations.
 * 
 * @param promise - The promise to wrap
 * @param defaultValue - Value to return if timeout occurs
 * @param ms - Timeout in milliseconds
 * @returns The result of the promise, or defaultValue on timeout
 * 
 * @example
 * const isAdmin = await withTimeoutFallback(
 *   checkAdminStatus(userId),
 *   false, // Default to non-admin on timeout
 *   5000
 * );
 */
export async function withTimeoutFallback<T>(
  promise: Promise<T>,
  defaultValue: T,
  ms: number = DEFAULT_QUERY_TIMEOUT
): Promise<T> {
  try {
    return await withTimeout(promise, ms);
  } catch (error) {
    if (error instanceof TimeoutError) {
      console.warn(`[Timeout] Falling back to default value:`, defaultValue);
      return defaultValue;
    }
    throw error;
  }
}

/**
 * Retry a function with exponential backoff.
 * 
 * @param fn - Async function to retry
 * @param maxRetries - Maximum number of retry attempts
 * @param baseDelay - Initial delay between retries in ms
 * @returns The result of the function if it succeeds
 * 
 * @example
 * const data = await retry(
 *   () => fetchDashboardStats(),
 *   3,
 *   1000
 * );
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.warn(`[Retry] Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

/**
 * Execute multiple promises with a concurrency limit to prevent
 * overwhelming the server with too many simultaneous requests.
 * 
 * @param tasks - Array of functions that return promises
 * @param concurrency - Maximum concurrent operations
 * @returns Array of results
 */
export async function withConcurrencyLimit<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number = 3
): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];

  for (const task of tasks) {
    const p = Promise.resolve().then(() => task()).then(result => {
      results.push(result);
    });
    executing.push(p);

    if (executing.length >= concurrency) {
      await Promise.race(executing);
      // Remove completed promises
      executing.splice(0, executing.length, ...executing.filter(p => {
        // This is a hack to check if promise is settled
        let settled = false;
        p.then(() => { settled = true; }, () => { settled = true; });
        return !settled;
      }));
    }
  }

  await Promise.all(executing);
  return results;
}
