import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '../lib/supabase';
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

// BroadcastChannel for cross-tab cart synchronization
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
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const loadingRef = useRef(false);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Initialize BroadcastChannel for cross-tab synchronization
  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') {
      broadcastChannelRef.current = new BroadcastChannel(CART_CHANNEL_NAME);
    }
    return () => {
      broadcastChannelRef.current?.close();
    };
  }, []);

  // Broadcast cart update to other tabs
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
      setIsLoading(true);
      console.log('[useCart] Loading cart for user:', uid);
      const dbCart = await getOrCreateCart(uid);
      console.log('[useCart] Cart loaded:', dbCart);
      if (dbCart) {
        setCart(toCartData(dbCart));
      } else {
        // If getOrCreateCart returns null, something went wrong
        console.error('[useCart] getOrCreateCart returned null');
        setCart(null);
      }
      setError(null);
    } catch (err) {
      console.error('[useCart] Failed to load cart:', err);
      setError('Failed to load your cart.');
      setCart(null);
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, []);

  // Refresh cart (exposed for manual refresh and cross-tab sync)
  const refreshCart = useCallback(async () => {
    if (userId) {
      await loadCart(userId);
    }
  }, [userId, loadCart]);

  // Check auth and load cart on mount
  useEffect(() => {
    let isActive = true;
    
    const initializeCart = async () => {
      console.log('[useCart] Initializing cart...');
      const { data: { session } } = await supabase.auth.getSession();
      console.log('[useCart] Session:', session?.user?.id);
      if (isActive && session?.user) {
        setUserId(session.user.id);
        await loadCart(session.user.id);
      } else if (isActive) {
        console.log('[useCart] No session, setting loading to false');
        setIsLoading(false);
      }
    };

    initializeCart();

    // Listen for auth changes (skip INITIAL_SESSION as we handle it in initializeCart)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[useCart] Auth state changed:', event, session?.user?.id);
      
      // Skip INITIAL_SESSION to avoid duplicate loading
      if (event === 'INITIAL_SESSION') {
        return;
      }
      
      if (isActive && session?.user) {
        setUserId(session.user.id);
        await loadCart(session.user.id);
      } else if (isActive) {
        setUserId(null);
        setCart(null);
        setIsLoading(false);
      }
    });

    // Listen for cart updates from other components (same tab)
    const handleCartUpdate = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadCart(session.user.id);
      }
    };

    globalThis.addEventListener('cartUpdated', handleCartUpdate);

    // Listen for cart updates from other tabs (cross-tab sync)
    const handleBroadcastMessage = (event: MessageEvent) => {
      if (event.data?.type === 'cart-updated') {
        console.log('[useCart] Received cross-tab cart update');
        handleCartUpdate();
      }
    };

    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.onmessage = handleBroadcastMessage;
    }

    return () => {
      isActive = false;
      subscription.unsubscribe();
      globalThis.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const addItem = useCallback(async (item: ItemData) => {
    if (!userId) {
      setError('Please log in to add items to cart');
      return;
    }

    try {
      const price = typeof item.price === 'string' ? Number.parseFloat(item.price) : item.price;
      const result = await apiAddItem(userId, {
        planId: item.planId,
        serviceName: item.serviceName,
        planName: item.planName,
        price,
        quantity: item.quantity
      });
      
      if (result) {
        setCart(toCartData(result));
        globalThis.dispatchEvent(new CustomEvent('cartUpdated'));
        broadcastCartUpdate(); // Notify other tabs
      }
      setError(null);
    } catch (err) {
      console.error('Add to cart failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to add item to cart');
    }
  }, [userId, broadcastCartUpdate]);

  const removeItem = useCallback(async (itemId: string) => {
    if (!userId) return;

    try {
      const result = await apiRemoveItem(userId, itemId);
      if (result) {
        setCart(toCartData(result));
        globalThis.dispatchEvent(new CustomEvent('cartUpdated'));
        broadcastCartUpdate(); // Notify other tabs
      }
      setError(null);
    } catch (err) {
      console.error('Remove from cart failed:', err);
      setError('Failed to remove item from cart');
    }
  }, [userId, broadcastCartUpdate]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (!userId) return;

    try {
      const result = await apiUpdateQuantity(userId, itemId, quantity);
      if (result) {
        setCart(toCartData(result));
        globalThis.dispatchEvent(new CustomEvent('cartUpdated'));
        broadcastCartUpdate(); // Notify other tabs
      }
      setError(null);
    } catch (err) {
      console.error('Update quantity failed:', err);
      setError('Failed to update quantity');
    }
  }, [userId, broadcastCartUpdate]);

  const applyDiscountCodeFn = useCallback(async (code: string): Promise<boolean> => {
    if (!userId || !cart) return false;

    try {
      const { success } = await apiApplyDiscount(userId, code, cart.subtotal);
      
      if (success) {
        // Reload cart to get updated discount
        const dbCart = await getOrCreateCart(userId);
        if (dbCart) {
          setCart(toCartData(dbCart));
        }
        setError(null);
      }

      return success;
    } catch (err) {
      console.error('Apply discount failed:', err);
      setError('Failed to apply discount code');
      return false;
    }
  }, [userId, cart]);

  const clearCartFn = useCallback(async () => {
    if (!userId) return;

    try {
      const result = await apiClearCart(userId);
      if (result) {
        setCart(toCartData(result));
        globalThis.dispatchEvent(new CustomEvent('cartUpdated'));
        broadcastCartUpdate(); // Notify other tabs
      }
      setError(null);
    } catch (err) {
      console.error('Clear cart failed:', err);
      setError('Failed to clear cart');
    }
  }, [userId, broadcastCartUpdate]);

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
    isAuthenticated: !!userId
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
    userId
  ]);
};
