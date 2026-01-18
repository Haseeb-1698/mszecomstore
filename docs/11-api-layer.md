# API Layer

This document covers the client-side API functions that interact with Supabase.

## Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         API Layer Structure                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   src/lib/                                                               │
│   ├── supabase.ts          # Supabase client configuration              │
│   ├── database.types.ts    # TypeScript types for database              │
│   ├── utils.ts             # Utility functions                          │
│   ├── constants.ts         # Application constants                      │
│   │                                                                      │
│   ├── api/                 # Domain-specific API modules                │
│   │   ├── cart.ts          # Cart operations                            │
│   │   ├── orders.ts        # Order operations                           │
│   │   ├── services.ts      # Service/product operations                 │
│   │   └── users.ts         # User profile operations                    │
│   │                                                                      │
│   └── utils/               # Utility helpers                            │
│       └── timeout.ts       # Timeout wrapper                            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Supabase Client

### File: `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.generated';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Client-side client (browser)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Server-side client (API routes)
export const createServerSupabaseClient = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
};

// Admin client (bypasses RLS)
export const createAdminSupabaseClient = () => {
  const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  return createClient<Database>(supabaseUrl, serviceRoleKey);
};
```

## Type Definitions

### File: `src/lib/database.types.ts`

```typescript
// Enum types
export type PlanType = 'shared' | 'dedicated';
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled';
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'delivered';
export type UserRole = 'customer' | 'admin';
export type ServiceBadge = 'popular' | 'best_value' | null;

// Row types (what database returns)
export interface DbService {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  long_description: string | null;
  icon_url: string | null;
  badge: ServiceBadge;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbPlan {
  id: string;
  service_id: string;
  name: string;
  type: PlanType;
  duration_months: number;
  price: number;
  original_price: number | null;
  savings: number | null;
  features: Json;
  is_popular: boolean;
  display_order: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

// Insert types (what you send to database)
export type DbServiceInsert = Omit<DbService, 'id' | 'created_at' | 'updated_at' | 'slug'>;
export type DbPlanInsert = Omit<DbPlan, 'id' | 'created_at' | 'updated_at'>;

// Update types (partial updates)
export type DbServiceUpdate = Partial<DbServiceInsert>;
export type DbPlanUpdate = Partial<DbPlanInsert>;
```

## Services API

### File: `src/lib/api/services.ts`

```typescript
import { supabase } from '../supabase';
import type { DbService, DbPlan } from '../database.types';

export interface ServiceWithPlansResponse extends DbService {
  plans: DbPlan[];
}

// Get all active services with their plans
export async function getServices(): Promise<ServiceWithPlansResponse[]> {
  const { data, error } = await supabase
    .from('services')
    .select(`
      *,
      plans (*)
    `)
    .eq('is_active', true)
    .order('display_order')
    .order('name');

  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }

  return (data as ServiceWithPlansResponse[]).map(service => ({
    ...service,
    slug: service.slug || service.name.toLowerCase().replaceAll(' ', '-'),
    icon_url: service.icon_url || '/icons/default-service.svg',
  }));
}

// Get single service by slug
export async function getServiceBySlug(slug: string): Promise<ServiceWithPlansResponse | null> {
  const { data, error } = await supabase
    .from('services')
    .select(`
      *,
      plans (*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    // Fallback: try matching by generated slug
    const { data: allServices } = await supabase
      .from('services')
      .select(`*, plans (*)`)
      .eq('is_active', true);

    const service = allServices?.find(
      s => s.slug === slug || s.name.toLowerCase().replaceAll(' ', '-') === slug
    );

    return service as ServiceWithPlansResponse ?? null;
  }

  return data as ServiceWithPlansResponse;
}

// Get service by ID
export async function getServiceById(id: string): Promise<ServiceWithPlansResponse | null> {
  const { data, error } = await supabase
    .from('services')
    .select(`*, plans (*)`)
    .eq('id', id)
    .single();

  if (error) return null;
  return data as ServiceWithPlansResponse;
}

// Get related services (same category)
export async function getRelatedServices(
  currentServiceId: string, 
  category: string, 
  limit = 4
): Promise<ServiceWithPlansResponse[]> {
  const { data, error } = await supabase
    .from('services')
    .select(`*, plans (*)`)
    .eq('category', category)
    .eq('is_active', true)
    .neq('id', currentServiceId)
    .limit(limit);

  if (error) return [];
  return data as ServiceWithPlansResponse[];
}
```

## Cart API

### File: `src/lib/api/cart.ts`

```typescript
import { supabase } from '../supabase';
import type { DbCart, DbCartItem, DbCartItemInsert } from '../database.types';

export interface CartWithItems extends DbCart {
  cart_items: DbCartItem[];
}

export interface CartData {
  id: string;
  userId: string;
  items: {
    id: string;
    planId: string;
    serviceName: string;
    planName: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  discount: number;
  total: number;
  itemCount: number;
}

// Timeout configuration
const TIMEOUT_CONFIG = {
  FETCH: 8000,
  CREATE: 10000,
  UPDATE: 8000,
} as const;

function withTimeout<T>(promise: PromiseLike<T>, ms: number, operation: string): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error(`${operation} timed out after ${ms}ms`)), ms)
    )
  ]);
}

// Get or create cart for user
export async function getOrCreateCart(userId: string): Promise<CartWithItems | null> {
  try {
    // Try to fetch existing cart
    const { data: existingCart, error: fetchError } = await withTimeout(
      supabase
        .from('carts')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle(),
      TIMEOUT_CONFIG.FETCH,
      'Fetch cart'
    );

    if (fetchError) {
      console.error('[getOrCreateCart] Fetch error:', fetchError);
      return null;
    }

    if (existingCart) {
      // Fetch cart items
      const { data: cartItems } = await withTimeout(
        supabase
          .from('cart_items')
          .select('*')
          .eq('cart_id', existingCart.id),
        TIMEOUT_CONFIG.FETCH,
        'Fetch cart items'
      );

      return { ...existingCart, cart_items: cartItems ?? [] } as CartWithItems;
    }

    // Create new cart
    const { data: newCart, error: createError } = await withTimeout(
      supabase
        .from('carts')
        .insert({ user_id: userId })
        .select('*')
        .single(),
      TIMEOUT_CONFIG.CREATE,
      'Create cart'
    );

    if (createError) {
      // Handle race condition (unique constraint)
      if (createError.code === '23505') {
        return getOrCreateCart(userId);  // Retry
      }
      return null;
    }

    return { ...newCart, cart_items: [] } as CartWithItems;
  } catch (err) {
    console.error('[getOrCreateCart] Error:', err);
    return null;
  }
}

// Add item to cart
export async function addItemToCart(
  userId: string,
  item: { planId: string; serviceName: string; planName: string; price: number }
): Promise<CartWithItems | null> {
  const cart = await getOrCreateCart(userId);
  if (!cart) return null;

  const existingItem = cart.cart_items.find(i => i.plan_id === item.planId);

  if (existingItem) {
    // Update quantity
    await supabase
      .from('cart_items')
      .update({ quantity: existingItem.quantity + 1 })
      .eq('id', existingItem.id);
  } else {
    // Insert new item
    const insertData: DbCartItemInsert = {
      cart_id: cart.id,
      plan_id: item.planId,
      service_name: item.serviceName,
      plan_name: item.planName,
      price: item.price,
      quantity: 1
    };

    await supabase.from('cart_items').insert(insertData);
  }

  return getOrCreateCart(userId);
}

// Remove item from cart
export async function removeItemFromCart(
  userId: string,
  itemId: string
): Promise<CartWithItems | null> {
  await supabase.from('cart_items').delete().eq('id', itemId);
  return getOrCreateCart(userId);
}

// Update item quantity
export async function updateItemQuantity(
  userId: string,
  itemId: string,
  quantity: number
): Promise<CartWithItems | null> {
  if (quantity <= 0) {
    return removeItemFromCart(userId, itemId);
  }

  await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId);

  return getOrCreateCart(userId);
}

// Clear all items from cart
export async function clearCart(userId: string): Promise<void> {
  const { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (cart) {
    await supabase.from('cart_items').delete().eq('cart_id', cart.id);
  }
}

// Apply discount code
export async function applyDiscountCode(
  userId: string,
  code: string
): Promise<{ success: boolean; discount: number }> {
  // Validate code (simplified - implement actual validation)
  const validCodes: Record<string, number> = {
    'SAVE10': 10,
    'SAVE20': 20,
  };

  const discount = validCodes[code.toUpperCase()];
  
  if (!discount) {
    return { success: false, discount: 0 };
  }

  // Update cart with discount
  await supabase
    .from('carts')
    .update({ discount, discount_code: code })
    .eq('user_id', userId);

  return { success: true, discount };
}

// Transform database cart to UI-friendly format
export function toCartData(cart: CartWithItems): CartData {
  const items = cart.cart_items.map(item => ({
    id: item.id,
    planId: item.plan_id,
    serviceName: item.service_name,
    planName: item.plan_name,
    price: Number(item.price),
    quantity: item.quantity
  }));

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = Number(cart.discount) || 0;
  const total = Math.max(0, subtotal - discount);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: cart.id,
    userId: cart.user_id,
    items,
    subtotal,
    discount,
    total,
    itemCount
  };
}
```

## Orders API

### File: `src/lib/api/orders.ts`

```typescript
import { supabase } from '../supabase';
import type { DbOrder, DbOrderItem, DbOrderInsert, DbOrderItemInsert, OrderStatus } from '../database.types';

export interface OrderWithItems extends DbOrder {
  items: DbOrderItem[];
}

export interface CreateOrderInput {
  userId: string;
  planId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
  specialInstructions?: string;
  items: {
    planId: string;
    serviceName: string;
    planName: string;
    durationMonths: number;
    price: number;
    quantity: number;
  }[];
}

// Create new order
export async function createOrder(input: CreateOrderInput): Promise<{ order: any; error: string | null }> {
  try {
    // Create order
    const orderInsert: DbOrderInsert = {
      user_id: input.userId,
      plan_id: input.planId,
      amount: input.amount,
      customer_name: input.customerName,
      customer_email: input.customerEmail,
      customer_whatsapp: input.customerWhatsapp,
      special_instructions: input.specialInstructions ?? null,
      status: 'pending'
    };

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderInsert)
      .select()
      .single();

    if (orderError) throw orderError;
    if (!order) throw new Error('No order returned');

    // Create order items
    if (input.items.length > 0) {
      const orderItems: DbOrderItemInsert[] = input.items.map(item => ({
        order_id: order.id,
        plan_id: item.planId,
        service_name: item.serviceName,
        plan_name: item.planName,
        duration_months: item.durationMonths,
        price: item.price,
        quantity: item.quantity
      }));

      await supabase.from('order_items').insert(orderItems);
    }

    return { order, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { order: null, error: message };
  }
}

// Get orders (optionally filtered by user)
export async function getOrders(userId?: string): Promise<OrderWithItems[]> {
  let query = supabase
    .from('orders')
    .select(`*, items:order_items (*)`)
    .order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return (data || []) as OrderWithItems[];
}

// Get single order
export async function getOrderById(orderId: string): Promise<OrderWithItems | null> {
  const { data, error } = await supabase
    .from('orders')
    .select(`*, items:order_items (*)`)
    .eq('id', orderId)
    .single();

  if (error) return null;
  return data as OrderWithItems;
}

// Update order status
export async function updateOrderStatus(
  orderId: string, 
  status: OrderStatus
): Promise<{ error: string | null }> {
  const updateData: Partial<DbOrder> = {
    status,
    updated_at: new Date().toISOString()
  };

  if (status === 'delivered') {
    updateData.delivered_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId);

  return { error: error?.message ?? null };
}
```

## Users API

### File: `src/lib/api/users.ts`

```typescript
import { supabase } from '../supabase';
import type { DbUserProfileUpdate, DbUserProfileInsert } from '../database.types';
import { withTimeout, SHORT_TIMEOUT } from '../utils/timeout';

// Get user profile
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await withTimeout(
      supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single(),
      SHORT_TIMEOUT,
      'User profile fetch timed out'
    );

    if (error) {
      if (error.code === 'PGRST116') return null;  // Not found
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return null;
  }
}

// Check if user is admin
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const { data, error } = await withTimeout(
      supabase
        .from('user_profiles')
        .select('role')
        .eq('id', userId)
        .single(),
      SHORT_TIMEOUT,
      'Admin check timed out'
    );

    if (error) return false;
    return data?.role === 'admin';
  } catch {
    return false;
  }
}

// Update user profile
export async function updateUserProfile(
  userId: string, 
  updates: DbUserProfileUpdate
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId);

  return { error: error?.message ?? null };
}

// Create user profile
export async function createUserProfile(
  userId: string,
  data: Omit<DbUserProfileInsert, 'id'>
): Promise<{ profile: any; error: string | null }> {
  try {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .insert({ id: userId, ...data })
      .select()
      .single();

    return { profile, error: error?.message ?? null };
  } catch (err) {
    return { profile: null, error: 'Failed to create profile' };
  }
}
```

## Utility Functions

### File: `src/lib/utils.ts`

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind classes
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Date utilities
export function dbDateToDate(dbDate: string): Date {
  return new Date(dbDate);
}

export function dateToDbDate(date: Date): string {
  return date.toISOString();
}

// Price formatting
export function formatPrice(price: number): string {
  return `Rs ${price.toLocaleString('en-PK')}`;
}

export function formatPriceWithDecimals(price: number): string {
  return `Rs ${price.toLocaleString('en-PK', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
}

// Date formatting
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
```

### File: `src/lib/utils/timeout.ts`

```typescript
export const SHORT_TIMEOUT = 5000;
export const DEFAULT_QUERY_TIMEOUT = 8000;

export function withTimeout<T>(
  promise: PromiseLike<T>,
  ms: number,
  message = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error(message)), ms)
    )
  ]);
}
```

## Error Handling Patterns

### Graceful Degradation

```typescript
const { data, error } = await supabase.from('services').select('*');

if (error) {
  console.error('Error fetching services:', error);
  return [];  // Return empty array, not throw
}

return data ?? [];
```

### Typed Error Checking

```typescript
export function isSupabaseError(error: unknown): error is { message: string; code: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'code' in error
  );
}

// Usage
try {
  // ... operation
} catch (error) {
  if (isSupabaseError(error)) {
    console.error(`Supabase error ${error.code}: ${error.message}`);
  }
}
```

---

Next: [Styling Guide](./12-styling.md)
