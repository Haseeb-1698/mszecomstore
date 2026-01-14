// TypeScript type definitions for MSZ Ecom Store
// This file contains UI-specific types and re-exports database types

// ============================================================================
// RE-EXPORTS FROM DATABASE TYPES (Source of truth for DB-related types)
// ============================================================================
export type { 
  // Database table types
  DbService, 
  DbPlan, 
  DbSubscription, 
  DbOrder,
  DbOrderItem,
  DbUserProfile,
  DbCart,
  DbCartItem,
  // View types
  DbServiceWithPlans,
  DbOrderDetails,
  DbAdminDashboardStats,
  // Extended types
  ServiceWithPlans,
  OrderWithItems,
  // Enum types
  SubscriptionStatus,
  OrderStatus,
  ServiceCategory,
  UserRole,
  ServiceBadge,
  PlanType
} from './database.types'

// Re-export constants
export {
  ORDER_STATUS,
  ORDER_STATUS_DISPLAY,
  ORDER_STATUS_COLORS,
  SUBSCRIPTION_STATUS,
  SUBSCRIPTION_STATUS_DISPLAY,
  SERVICE_CATEGORY,
  SERVICE_CATEGORY_DISPLAY,
  USER_ROLE,
  SERVICE_BADGE,
  PLAN_TYPE,
  ROUTES,
  STORAGE_KEYS,
  PAGINATION,
  API_CONFIG,
  type OrderStatusValue,
  type SubscriptionStatusValue,
  type ServiceCategoryValue,
  type UserRoleValue,
  type ServiceBadgeValue,
  type PlanTypeValue,
} from './constants'

// ============================================================================
// UI-ONLY TYPES (Not directly from database)
// ============================================================================

/**
 * Testimonial for homepage display
 */
export interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  serviceUsed?: string;
  verified: boolean;
}

/**
 * Customer stats for dashboard display
 */
export interface UserStats {
  totalSpent: number;
  activeSubscriptions: number;
  savedThisYear: number;
  loyaltyPoints: number;
}

/**
 * Admin dashboard stats
 */
export interface AdminStats {
  totalRevenue: number;
  pendingOrders: number;
  activeCustomers: number;
  deliveredToday: number;
  growthRate?: number;
}

/**
 * Quick action button for admin dashboard
 */
export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
}

/**
 * Checkout session for tracking checkout flow
 */
export interface CheckoutSession {
  id: string;
  cartId: string;
  customerInfo: {
    name: string;
    email: string;
    whatsapp: string;
  };
  status: import('./database.types').OrderStatus;
  createdAt: Date;
  expiresAt: Date;
}

/**
 * Cart item for UI display (simplified from DB type)
 */
export interface CartItemUI {
  id: string;
  planId: string;
  serviceName: string;
  planName: string;
  price: number;
  quantity: number;
}

/**
 * Cart data for UI (transformed from DB)
 */
export interface CartDataUI {
  id: string;
  userId: string;
  items: CartItemUI[];
  subtotal: number;
  discount: number;
  total: number;
}

// ============================================================================
// PAGINATION TYPES
// ============================================================================

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiError {
  message: string;
  code?: string;
  details?: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  success: boolean;
}
