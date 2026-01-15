/**
 * useCart Hook - Core cart state management
 * 
 * ARCHITECTURE NOTES:
 * - This hook is meant to be used INSIDE a provider tree (SupabaseAuthProvider → CartProvider)
 * - It consumes auth state from useSupabaseAuth() instead of making direct Supabase calls
 * - Cross-tab sync uses BroadcastChannel ONLY (no same-tab events to avoid loops)
 * - Components should use useCartContext() from CartContext, not this hook directly
 * 
 * For standalone usage (e.g., Header CartIcon outside providers), use CartIconStandalone component
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { 
  getOrCreateCart, 
  addItemToCart as apiAddItem, 
  removeItemFromCart as apiRemoveItem,
  updateItemQuantity as apiUpdateQuantity,
  clearCart as apiClearCart,
  applyDiscountCode as apiApplyDiscount,
  toCartData,
  type CartData
} from '../lib/api/cart';

// BroadcastChannel for cross-tab cart synchronization ONLY
const CART_CHANNEL_NAME = 'cart-sync';

export interface ItemData {
  serviceId: string;
  serviceName: string;
  planId: string;
  planName: string;
  price: number | string;
  quantity?: number;
}

export interface UseCartReturn {
  cart: CartData | null;
  addItem: (item: ItemData) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  applyDiscountCode: (code: string) => Promise<boolean>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  itemCount: number;
  isEmpty: boolean;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export const useCart = (): UseCartReturn => {
  // Consume auth from context - single source of truth
  const { user, isReady: authReady } = useSupabaseAuth();
  
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Refs to prevent race conditions
  const loadingRef = useRef(false);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const mountedRef = useRef(true);

  // Initialize BroadcastChannel for cross-tab synchronization
  useEffect(() => {
    mountedRef.current = true;
    
    if (typeof BroadcastChannel !== 'undefined') {
      broadcastChannelRef.current = new BroadcastChannel(CART_CHANNEL_NAME);
    }
    
    return () => {
      mountedRef.current = false;
      broadcastChannelRef.current?.close();
    };
  }, []);

  // Broadcast cart update to other tabs ONLY
  const broadcastCartUpdate = useCallback(() => {
    broadcastChannelRef.current?.postMessage({ type: 'cart-updated' });
  }, []);

  // Load cart from database
  const loadCart = useCallback(async (uid: string) => {
    // Skip if already loading to prevent concurrent calls
    if (loadingRef.current) {
      console.log('[useCart] Load already in progress, skipping...');
      return;
    }

    try {
      loadingRef.current = true;
      setIsLoading(true); // ALWAYS set loading, even if unmounted
      
      console.log('[useCart] Loading cart for user:', uid);
      const dbCart = await getOrCreateCart(uid);
      
      console.log('[useCart] Cart loaded successfully:', { 
        hasCart: !!dbCart, 
        itemCount: dbCart?.cart_items?.length || 0 
      });
      
      if (dbCart) {
        const cartData = toCartData(dbCart);
        setCart(cartData);
        // Cache count in localStorage for CartIcon
        localStorage.setItem('cart-count', cartData.itemCount.toString());
      } else {
        console.error('[useCart] getOrCreateCart returned null');
        setCart(null);
        localStorage.setItem('cart-count', '0');
      }
      setError(null);
    } catch (err) {
      console.error('[useCart] Failed to load cart:', err);
      setError('Failed to load your cart.');
      setCart(null);
      localStorage.setItem('cart-count', '0');
    } finally {
      // ALWAYS set loading to false, regardless of mounted state
      setIsLoading(false);
      loadingRef.current = false;
      console.log('[useCart] Load cart completed, isLoading set to false');
    }
  }, []);

  // Refresh cart (exposed for manual refresh)
  const refreshCart = useCallback(async () => {
    if (user?.id) {
      await loadCart(user.id);
    }
  }, [user?.id, loadCart]);

  // Load cart when auth is ready and user is available
  useEffect(() => {
    console.log('[useCart] Auth effect triggered:', { 
      authReady, 
      userId: user?.id,
      hasLoadCart: !!loadCart 
    });
    
    if (!authReady) {
      // Auth still initializing - keep loading state
      console.log('[useCart] Auth not ready yet, waiting...');
      return;
    }

    if (user?.id) {
      console.log('[useCart] Auth ready with user, loading cart for:', user.id);
      loadCart(user.id);
    } else {
      // Auth ready but no user - not authenticated
      console.log('[useCart] Auth ready but no user - clearing cart state');
      setCart(null);
      setIsLoading(false);
      localStorage.setItem('cart-count', '0');
    }
  }, [authReady, user?.id, loadCart]);

  // Safety timeout - force loading to false after 20 seconds
  useEffect(() => {
    if (!isLoading) return;
    
    const timeout = setTimeout(() => {
      console.error('[useCart] TIMEOUT: Loading took too long, forcing to false');
      setIsLoading(false);
      setError('Cart loading timed out. Please refresh the page.');
    }, 20000); // 20 seconds safety timeout

    return () => clearTimeout(timeout);
  }, [isLoading]);

  // Listen for cart updates from OTHER tabs only (cross-tab sync)
  useEffect(() => {
    const handleBroadcastMessage = (event: MessageEvent) => {
      if (event.data?.type === 'cart-updated' && user?.id && mountedRef.current) {
        console.log('[useCart] Received cross-tab cart update');
        loadCart(user.id);
      }
    };

    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.onmessage = handleBroadcastMessage;
    }

    return () => {
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.onmessage = null;
      }
    };
  }, [user?.id, loadCart]);

  const addItem = useCallback(async (item: ItemData) => {
    if (!user?.id) {
      setError('Please log in to add items to cart');
      return;
    }

    try {
      const price = typeof item.price === 'string' ? Number.parseFloat(item.price) : item.price;
      const result = await apiAddItem(user.id, {
        planId: item.planId,
        serviceName: item.serviceName,
        planName: item.planName,
        price,
        quantity: item.quantity
      });
      
      if (result) {
        const cartData = toCartData(result);
        setCart(cartData);
        // Cache count and broadcast with count
        localStorage.setItem('cart-count', cartData.itemCount.toString());
        broadcastChannelRef.current?.postMessage({ 
          type: 'cart-updated',
          count: cartData.itemCount 
        });
      }
      setError(null);
    } catch (err) {
      console.error('Add to cart failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to add item to cart');
    }
  }, [user?.id]);

  const removeItem = useCallback(async (itemId: string) => {
    if (!user?.id) return;

    try {
      const result = await apiRemoveItem(user.id, itemId);
      if (result) {
        const cartData = toCartData(result);
        setCart(cartData);
        localStorage.setItem('cart-count', cartData.itemCount.toString());
        broadcastChannelRef.current?.postMessage({ 
          type: 'cart-updated',
          count: cartData.itemCount 
        });
      }
      setError(null);
    } catch (err) {
      console.error('Remove from cart failed:', err);
      setError('Failed to remove item from cart');
    }
  }, [user?.id]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (!user?.id) return;

    try {
      const result = await apiUpdateQuantity(user.id, itemId, quantity);
      if (result) {
        const cartData = toCartData(result);
        setCart(cartData);
        localStorage.setItem('cart-count', cartData.itemCount.toString());
        broadcastChannelRef.current?.postMessage({ 
          type: 'cart-updated',
          count: cartData.itemCount 
        });
      }
      setError(null);
    } catch (err) {
      console.error('Update quantity failed:', err);
      setError('Failed to update quantity');
    }
  }, [user?.id]);

  const applyDiscountCodeFn = useCallback(async (code: string): Promise<boolean> => {
    if (!user?.id || !cart) return false;

    try {
      const { success } = await apiApplyDiscount(user.id, code, cart.subtotal);
      
      if (success && mountedRef.current) {
        // Reload cart to get updated discount
        const dbCart = await getOrCreateCart(user.id);
        if (dbCart && mountedRef.current) {
          setCart(toCartData(dbCart));
        }
        setError(null);
      }

      return success;
    } catch (err) {
      console.error('Apply discount failed:', err);
      if (mountedRef.current) {
        setError('Failed to apply discount code');
      }
      return false;
    }
  }, [user?.id, cart]);

  const clearCartFn = useCallback(async () => {
    if (!user?.id) return;

    try {
      const result = await apiClearCart(user.id);
      if (result) {
        const cartData = toCartData(result);
        setCart(cartData);
        localStorage.setItem('cart-count', '0');
        broadcastChannelRef.current?.postMessage({ 
          type: 'cart-updated',
          count: 0 
        });
      }
      setError(null);
    } catch (err) {
      console.error('Clear cart failed:', err);
      setError('Failed to clear cart');
    }
  }, [user?.id]);

  const itemCount = useMemo(
    () => cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
    [cart?.items]
  );
  
  const isEmpty = useMemo(
    () => !cart || cart.items.length === 0,
    [cart]
  );

  return useMemo(() => ({
    cart,
    addItem,
    removeItem,
    updateQuantity,
    applyDiscountCode: applyDiscountCodeFn,
    clearCart: clearCartFn,
    refreshCart,
    itemCount,
    isEmpty,
    isLoading,
    error,
    isAuthenticated: !!user
  }), [
    cart, 
    addItem, 
    removeItem, 
    updateQuantity, 
    applyDiscountCodeFn, 
    clearCartFn, 
    refreshCart,
    itemCount, 
    isEmpty, 
    isLoading, 
    error, 
    user
  ]);
};
