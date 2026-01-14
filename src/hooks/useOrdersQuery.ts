/**
 * TanStack Query hooks for orders
 * 
 * These hooks provide data fetching, caching, and mutation capabilities
 * for order-related operations.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../providers/QueryProvider';
import { 
  getOrders, 
  getOrderById, 
  createOrder, 
  updateOrderStatus,
  getAdminDashboardStats,
  type CreateOrderInput,
  type OrderWithItems 
} from '../lib/api/orders';
import type { OrderStatus } from '../lib/database.types';

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Fetch all orders for a user or all orders (admin)
 */
export function useOrders(userId?: string) {
  return useQuery({
    queryKey: queryKeys.orders.list({ userId }),
    queryFn: () => getOrders(userId),
  });
}

/**
 * Fetch a single order by ID
 */
export function useOrder(orderId: string) {
  return useQuery({
    queryKey: queryKeys.orders.detail(orderId),
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
  });
}

/**
 * Fetch admin dashboard statistics
 */
export function useAdminStats() {
  return useQuery({
    queryKey: queryKeys.stats.admin(),
    queryFn: getAdminDashboardStats,
    staleTime: 30 * 1000, // 30 seconds - stats update frequently
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Create a new order
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (input: CreateOrderInput) => createOrder(input),
    onSuccess: (result) => {
      if (result.order) {
        // Invalidate orders list to refetch
        queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
        // Also invalidate stats
        queryClient.invalidateQueries({ queryKey: queryKeys.stats.all });
      }
    },
  });
}

/**
 * Update order status
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      updateOrderStatus(orderId, status),
    onSuccess: (_, variables) => {
      // Invalidate the specific order
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.orders.detail(variables.orderId) 
      });
      // Also invalidate orders list
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
      // And stats
      queryClient.invalidateQueries({ queryKey: queryKeys.stats.all });
    },
    // Optimistic update
    onMutate: async ({ orderId, status }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: queryKeys.orders.detail(orderId) 
      });
      
      // Snapshot the previous value
      const previousOrder = queryClient.getQueryData<OrderWithItems>(
        queryKeys.orders.detail(orderId)
      );
      
      // Optimistically update to the new value
      if (previousOrder) {
        queryClient.setQueryData<OrderWithItems>(
          queryKeys.orders.detail(orderId),
          { ...previousOrder, status }
        );
      }
      
      return { previousOrder };
    },
    // Rollback on error
    onError: (_, variables, context) => {
      if (context?.previousOrder) {
        queryClient.setQueryData(
          queryKeys.orders.detail(variables.orderId),
          context.previousOrder
        );
      }
    },
  });
}
