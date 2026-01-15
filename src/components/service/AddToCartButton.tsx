/**
 * AddToCartButton - Standalone add-to-cart button for service/plan pages
 * 
 * ARCHITECTURE NOTE:
 * This component runs OUTSIDE the main AppProviders tree (on service detail pages
 * that may not have full provider wrapping). It manages its own auth state and
 * uses BroadcastChannel to notify other tabs of cart changes.
 * 
 * The cart icon in Header and CartPage will receive these updates via BroadcastChannel.
 */

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { addItemToCart } from '../../lib/api/cart';

// BroadcastChannel for cross-tab cart synchronization
const CART_CHANNEL_NAME = 'cart-sync';

interface Plan {
  id: string;
  name: string;
  tier?: string;
  duration_months: number;
  price: number;
  original_price?: number;
  savings?: number;
  features?: string[];
  is_popular?: boolean;
  is_available?: boolean;
  badge?: string;
  description?: string;
}

interface AddToCartButtonProps {
  serviceId: string;
  serviceName: string;
  plan: Plan;
  onAddToCart?: () => void;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  serviceId,
  serviceName,
  plan,
  onAddToCart
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    // Initialize BroadcastChannel
    if (typeof BroadcastChannel !== 'undefined') {
      broadcastChannelRef.current = new BroadcastChannel(CART_CHANNEL_NAME);
    }

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setCheckingAuth(false);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
      broadcastChannelRef.current?.close();
    };
  }, []);

  const handleAddToCart = async () => {
    // If not logged in, redirect to login - user must be authenticated to add items
    if (!user) {
      globalThis.location.href = '/login?redirect=' + encodeURIComponent(globalThis.location.pathname);
      return;
    }

    setIsAdding(true);
    
    try {
      // Add item to cart in database
      const updatedCart = await addItemToCart(user.id, {
        planId: plan.id,
        serviceName,
        planName: `${plan.duration_months} Month${plan.duration_months > 1 ? 's' : ''}`,
        price: plan.price
      });
      
      if (!updatedCart) {
        throw new Error('Failed to add item to cart');
      }
      
      // Calculate item count and broadcast to CartIcon
      const itemCount = updatedCart.cart_items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      localStorage.setItem('cart-count', itemCount.toString());
      broadcastChannelRef.current?.postMessage({ 
        type: 'cart-updated',
        count: itemCount 
      });
      
      setIsAdded(true);
      onAddToCart?.();
      
      // Reset the "Added" state after 2 seconds
      setTimeout(() => setIsAdded(false), 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  if (checkingAuth) {
    return (
      <button
        disabled
        className="w-full px-6 py-3 rounded-full bg-cream-300 dark:bg-charcoal-600 text-charcoal-500 dark:text-cream-400 font-medium transition-all cursor-not-allowed"
      >
        Loading...
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || isAdded}
      className={`w-full px-6 py-3 rounded-full font-medium transition-all flex items-center justify-center gap-2 ${
        isAdded
          ? 'bg-green-500 text-white'
          : 'bg-coral-500 text-white hover:bg-coral-600 shadow-soft hover:shadow-soft-lg'
      } ${(isAdding || isAdded) ? 'cursor-not-allowed' : ''}`}
    >
  {(() => {
        if (isAdding) {
          return (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </>
          );
        }
        if (isAdded) {
          return (
            <>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Added to Cart
            </>
          );
        }
        return (
          <>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Add to Cart
          </>
        );
      })()}
    </button>
  );
};

export default AddToCartButton;
