// TypeScript type definitions for MSZ Ecom Store
// Re-exports database types for convenience
export type { 
  DbService, 
  DbPlan, 
  DbSubscription, 
  DbOrder,
  DbOrderItem,
  DbUserProfile,
  DbServiceWithPlans,
  DbOrderDetails,
  DbAdminDashboardStats,
  ServiceWithPlans,
  OrderWithItems,
  SubscriptionStatus,
  OrderStatus,
  ServiceCategory,
  UserRole,
  ServiceBadge
} from './database.types'

import type { SubscriptionStatus, OrderStatus, UserRole } from './database.types'

// Legacy type alias for backwards compatibility
export type ServiceCategoryLegacy = 
  | "streaming" 
  | "professional" 
  | "vpn" 
  | "gaming" 
  | "education";

export interface Plan {
  id: string;
  duration: "1 month" | "3 months" | "12 months";
  price: number;
  originalPrice?: number;
  savings?: number;
  features: string[];
  isPopular?: boolean;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  category: string;
  logo: string;
  description: string;
  longDescription?: string;
  features: string[];
  plans: Plan[];
  badge?: "Popular" | "Best Value" | null;
  relatedServices: string[];
}

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

export interface Customer {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  subscriptions: Subscription[];
  orders: Order[];
  totalSpent: number;
  joinDate: Date;
}

export interface Subscription {
  id: string;
  serviceId: string;
  planId: string;
  startDate: Date;
  expiryDate: Date;
  status: SubscriptionStatus; // Now uses database type
  daysRemaining: number;
  autoRenew: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  customerWhatsapp?: string;
  serviceName?: string;
  serviceId: string;
  planId: string;
  amount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt?: Date;
  deliveredAt?: Date;
  specialInstructions?: string;
}

export interface CartItem {
  id: string;
  serviceId: string;
  planId: string;
  serviceName: string;
  planDuration: string;
  price: number;
  quantity: number;
}

export interface Cart {
  id: string;
  customerId?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CheckoutSession {
  id: string;
  cartId: string;
  customerInfo: {
    name: string;
    email: string;
    whatsapp: string;
  };
  status: OrderStatus;
  createdAt: Date;
  expiresAt: Date;
}

export interface DashboardStats {
  totalRevenue: number;
  pendingOrders: number;
  activeCustomers: number;
  deliveredToday: number;
  growthRate: number;
}

export interface UserStats {
  totalSpent: number;
  activeSubscriptions: number;
  savedThisYear: number;
  loyaltyPoints: number;
}

export interface AdminStats {
  totalRevenue: number;
  pendingOrders: number;
  activeCustomers: number;
  deliveredToday: number;
  growthRate?: number;
}

export interface AdminOrder extends Order {
  customerName: string;
  serviceName: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}

// Order status display mapping
export const OrderStatusDisplay: Record<OrderStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  completed: 'Completed',
  cancelled: 'Cancelled',
  delivered: 'Delivered'
}
