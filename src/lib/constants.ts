// Application-wide constants for MSZ Ecom Store

// ============================================================================
// ORDER STATUS
// ============================================================================
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  DELIVERED: 'delivered',
} as const;

export type OrderStatusKey = keyof typeof ORDER_STATUS;
export type OrderStatusValue = typeof ORDER_STATUS[OrderStatusKey];

export const ORDER_STATUS_DISPLAY: Record<OrderStatusValue, string> = {
  [ORDER_STATUS.PENDING]: 'Pending',
  [ORDER_STATUS.PROCESSING]: 'Processing',
  [ORDER_STATUS.COMPLETED]: 'Completed',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
  [ORDER_STATUS.DELIVERED]: 'Delivered',
};

export const ORDER_STATUS_COLORS: Record<OrderStatusValue, { bg: string; text: string }> = {
  [ORDER_STATUS.PENDING]: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400' },
  [ORDER_STATUS.PROCESSING]: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
  [ORDER_STATUS.COMPLETED]: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
  [ORDER_STATUS.CANCELLED]: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
  [ORDER_STATUS.DELIVERED]: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400' },
};

// ============================================================================
// SUBSCRIPTION STATUS
// ============================================================================
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
} as const;

export type SubscriptionStatusKey = keyof typeof SUBSCRIPTION_STATUS;
export type SubscriptionStatusValue = typeof SUBSCRIPTION_STATUS[SubscriptionStatusKey];

export const SUBSCRIPTION_STATUS_DISPLAY: Record<SubscriptionStatusValue, string> = {
  [SUBSCRIPTION_STATUS.ACTIVE]: 'Active',
  [SUBSCRIPTION_STATUS.EXPIRED]: 'Expired',
  [SUBSCRIPTION_STATUS.CANCELLED]: 'Cancelled',
};

// ============================================================================
// SERVICE CATEGORIES
// ============================================================================
export const SERVICE_CATEGORY = {
  STREAMING: 'streaming',
  PROFESSIONAL: 'professional',
  VPN: 'vpn',
  GAMING: 'gaming',
  EDUCATION: 'education',
  MUSIC: 'music',
  PRODUCTIVITY: 'productivity',
  OTHER: 'other',
} as const;

export type ServiceCategoryKey = keyof typeof SERVICE_CATEGORY;
export type ServiceCategoryValue = typeof SERVICE_CATEGORY[ServiceCategoryKey];

export const SERVICE_CATEGORY_DISPLAY: Record<ServiceCategoryValue, string> = {
  [SERVICE_CATEGORY.STREAMING]: 'Streaming',
  [SERVICE_CATEGORY.PROFESSIONAL]: 'Professional',
  [SERVICE_CATEGORY.VPN]: 'VPN',
  [SERVICE_CATEGORY.GAMING]: 'Gaming',
  [SERVICE_CATEGORY.EDUCATION]: 'Education',
  [SERVICE_CATEGORY.MUSIC]: 'Music',
  [SERVICE_CATEGORY.PRODUCTIVITY]: 'Productivity',
  [SERVICE_CATEGORY.OTHER]: 'Other',
};

// ============================================================================
// PLAN TYPES
// ============================================================================
export const PLAN_TYPE = {
  SHARED: 'shared',
  DEDICATED: 'dedicated',
} as const;

export type PlanTypeKey = keyof typeof PLAN_TYPE;
export type PlanTypeValue = typeof PLAN_TYPE[PlanTypeKey];

// ============================================================================
// USER ROLES
// ============================================================================
export const USER_ROLE = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
} as const;

export type UserRoleKey = keyof typeof USER_ROLE;
export type UserRoleValue = typeof USER_ROLE[UserRoleKey];

// ============================================================================
// SERVICE BADGES
// ============================================================================
export const SERVICE_BADGE = {
  POPULAR: 'popular',
  BEST_VALUE: 'best_value',
} as const;

export type ServiceBadgeKey = keyof typeof SERVICE_BADGE;
export type ServiceBadgeValue = typeof SERVICE_BADGE[ServiceBadgeKey] | null;

// ============================================================================
// APPLICATION ROUTES
// ============================================================================
export const ROUTES = {
  HOME: '/',
  SERVICES: '/services',
  ABOUT: '/about',
  CONTACT: '/contact',
  HOW_IT_WORKS: '/how-it-works',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  SUBSCRIPTIONS: '/subscriptions',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  ADMIN: {
    HOME: '/admin',
    ORDERS: '/admin/orders',
    SERVICES: '/admin/services',
    CUSTOMERS: '/admin/customers',
    SETTINGS: '/admin/settings',
  },
} as const;

// ============================================================================
// STORAGE KEYS
// ============================================================================
export const STORAGE_KEYS = {
  THEME: 'theme',
  PENDING_CART_ITEM: 'pendingCartItem',
} as const;

// ============================================================================
// PAGINATION
// ============================================================================
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  ADMIN_PAGE_SIZE: 15,
  MAX_PAGE_SIZE: 100,
} as const;

// ============================================================================
// API CONFIG
// ============================================================================
export const API_CONFIG = {
  RETRY_COUNT: 3,
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_TIME: 30 * 60 * 1000, // 30 minutes
} as const;
