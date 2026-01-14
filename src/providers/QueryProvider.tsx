/**
 * TanStack Query Provider Setup
 * 
 * This provider wraps the application with React Query's QueryClientProvider,
 * enabling efficient data fetching, caching, and state synchronization.
 */

import React, { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { API_CONFIG } from '../lib/constants';

// Create a client with sensible defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: API_CONFIG.STALE_TIME,
      gcTime: API_CONFIG.CACHE_TIME, // Previously cacheTime
      retry: API_CONFIG.RETRY_COUNT,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// Export the client for direct access in specific use cases
export { queryClient };

// Query key factory for consistent key generation
export const queryKeys = {
  all: ['msz-ecom'] as const,
  
  // Services
  services: {
    all: ['msz-ecom', 'services'] as const,
    lists: () => [...queryKeys.services.all, 'list'] as const,
    list: (filters?: { category?: string; active?: boolean }) =>
      [...queryKeys.services.lists(), filters] as const,
    details: () => [...queryKeys.services.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.services.details(), id] as const,
    bySlug: (slug: string) => [...queryKeys.services.all, 'slug', slug] as const,
  },
  
  // Orders
  orders: {
    all: ['msz-ecom', 'orders'] as const,
    lists: () => [...queryKeys.orders.all, 'list'] as const,
    list: (filters?: { userId?: string; status?: string }) =>
      [...queryKeys.orders.lists(), filters] as const,
    details: () => [...queryKeys.orders.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.orders.details(), id] as const,
    admin: () => [...queryKeys.orders.all, 'admin'] as const,
  },
  
  // Subscriptions
  subscriptions: {
    all: ['msz-ecom', 'subscriptions'] as const,
    lists: () => [...queryKeys.subscriptions.all, 'list'] as const,
    list: (filters?: { userId?: string; status?: string }) =>
      [...queryKeys.subscriptions.lists(), filters] as const,
    details: () => [...queryKeys.subscriptions.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.subscriptions.details(), id] as const,
  },
  
  // Users
  users: {
    all: ['msz-ecom', 'users'] as const,
    profile: (userId: string) => [...queryKeys.users.all, 'profile', userId] as const,
    admin: {
      all: () => [...queryKeys.users.all, 'admin'] as const,
      list: () => [...queryKeys.users.admin.all(), 'list'] as const,
    },
  },
  
  // Cart
  cart: {
    all: ['msz-ecom', 'cart'] as const,
    user: (userId: string) => [...queryKeys.cart.all, userId] as const,
  },
  
  // Dashboard Stats
  stats: {
    all: ['msz-ecom', 'stats'] as const,
    admin: () => [...queryKeys.stats.all, 'admin'] as const,
    customer: (userId: string) => [...queryKeys.stats.all, 'customer', userId] as const,
  },
} as const;

export default QueryProvider;
