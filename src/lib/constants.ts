// Application-wide constants for MSZ Ecom Store

// ============================================================================
// API CONFIG
// ============================================================================
export const API_CONFIG = {
  RETRY_COUNT: 3,
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_TIME: 30 * 60 * 1000, // 30 minutes
} as const;
