/**
 * CartIcon - Lightweight cart badge for Header
 * 
 * ARCHITECTURE NOTE:
 * This is a lightweight component that DOES NOT create its own provider instances.
 * Instead, it:
 * 1. Listens for cart updates via BroadcastChannel
 * 2. Checks auth state directly (one-time check)
 * 3. Displays cart item count without loading full cart data
 * 
 * This prevents multiple provider instances and reduces the load on the cart page.
 */

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';

const CART_CHANNEL_NAME = 'cart-sync';

const CartIcon: React.FC = () => {
  const [itemCount, setItemCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const mountedRef = useRef(true);

  // Check auth once on mount
  useEffect(() => {
    mountedRef.current = true;
    
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mountedRef.current) {
          setIsAuthenticated(!!session?.user);
          setIsReady(true);
          
          // If authenticated, try to get initial count from localStorage
          if (session?.user) {
            const cachedCount = localStorage.getItem('cart-count');
            if (cachedCount) {
              setItemCount(parseInt(cachedCount, 10) || 0);
            }
          }
        }
      } catch (error) {
        console.error('[CartIcon] Auth check failed:', error);
        if (mountedRef.current) {
          setIsReady(true);
        }
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (mountedRef.current) {
        setIsAuthenticated(!!session?.user);
        if (!session?.user) {
          setItemCount(0);
        }
      }
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  // Listen for cart updates via BroadcastChannel
  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') {
      broadcastChannelRef.current = new BroadcastChannel(CART_CHANNEL_NAME);
      
      broadcastChannelRef.current.onmessage = (event) => {
        if (mountedRef.current && event.data?.type === 'cart-updated') {
          // If count is provided directly, use it
          if (typeof event.data.count === 'number') {
            setItemCount(event.data.count);
            localStorage.setItem('cart-count', event.data.count.toString());
          } else {
            // Otherwise, reload count from localStorage
            const cachedCount = localStorage.getItem('cart-count');
            if (cachedCount) {
              setItemCount(parseInt(cachedCount, 10) || 0);
            }
          }
        }
      };
    }

    return () => {
      broadcastChannelRef.current?.close();
    };
  }, []);

  // Don't render until auth check is complete
  if (!isReady) {
    return null;
  }

  // Don't show cart icon if not logged in
  if (!isAuthenticated) {
    return null;
  }

  return (
    <a
      href="/cart"
      className="relative inline-flex items-center justify-center p-2 rounded-lg hover:bg-cream-200 dark:hover:bg-charcoal-800 transition-colors group"
      aria-label="Shopping Cart"
    >
      <svg
        className="w-6 h-6 text-charcoal-800 dark:text-cream-100 group-hover:text-coral-500 dark:group-hover:text-coral-400 transition-colors"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-coral-500 rounded-full shadow-soft">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </a>
  );
};

export default CartIcon;
