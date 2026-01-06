// TypeScript type definitions for MSZ Ecom Store

export type ServiceCategory = 
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
  category: ServiceCategory;
  logo: string;
  description: string;
  features: string[];
  plans: Plan[];
  badge?: "Popular" | "Best Value";
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
  status: "active" | "expired";
  daysRemaining: number;
  autoRenew: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  customerName?: string;
  serviceName?: string;
  serviceId: string;
  planId: string;
  amount: number;
  status: "pending" | "paid" | "delivered" | "failed";
  paymentMethod: "EasyPaisa" | "JazzCash" | "Bank Transfer";
  createdAt: Date;
  deliveredAt?: Date;
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
  paymentMethod: "EasyPaisa" | "JazzCash" | "Bank Transfer";
  status: "pending" | "processing" | "completed" | "failed";
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
  role: "customer" | "admin";
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}
