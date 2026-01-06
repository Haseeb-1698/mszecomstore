import { useState, useEffect, useCallback } from 'react';
import type { Cart } from '../lib/types';
import { cartUtils } from '../lib/cart';

export interface UseCartReturn {
  cart: Cart;
  addItem: (serviceSlug: string, tierIndex?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  applyDiscountCode: (code: string) => boolean;
  clearCart: () => void;
  itemCount: number;
  isEmpty: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useCart = (): UseCartReturn => {
  const [cart, setCart] = useState<Cart>(() => cartUtils.create());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        // Clear localStorage for testing (remove this in production)
        localStorage.removeItem('cart');
        
        const savedCart = cartUtils.load();
        let cartToUse = cartUtils.create();
        if (savedCart) {
          const validatedCart = cartUtils.validate(savedCart);
          cartToUse = validatedCart;
        }
        
        // Add dummy items for testing if cart is empty
        if (cartToUse.items.length === 0) {
          cartToUse = cartUtils.addItem(cartToUse, 'netflix', 1); // Standard plan
          cartToUse = cartUtils.addItem(cartToUse, 'spotify', 0); // Individual plan
          cartToUse = cartUtils.addItem(cartToUse, 'disney-plus', 1); // Premium (No Ads)
          cartUtils.save(cartToUse);
        }
        
        setCart(cartToUse);
        setError(null);
      } catch (err) {
        console.error('Failed to load cart:', err);
        setError('Failed to load your cart. Starting with an empty cart.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        cartUtils.save(cart);
        setError(null);
      } catch (err) {
        console.error('Failed to save cart:', err);
        setError('Failed to save your cart.');
      }
    }
  }, [cart, isLoading]);

  const addItem = useCallback((serviceSlug: string, tierIndex: number = 0) => {
    try {
      setCart(currentCart => cartUtils.addItem(currentCart, serviceSlug, tierIndex));
      setError(null);
    } catch (err) {
      console.error('Add to cart failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to add item to cart');
    }
  }, []);

  const removeItem = useCallback((itemId: string) => {
    try {
      setCart(currentCart => cartUtils.removeItem(currentCart, itemId));
      setError(null);
    } catch (err) {
      console.error('Remove from cart failed:', err);
      setError('Failed to remove item from cart');
    }
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    try {
      setCart(currentCart => cartUtils.updateQuantity(currentCart, itemId, quantity));
      setError(null);
    } catch (err) {
      console.error('Update quantity failed:', err);
      setError('Failed to update quantity');
    }
  }, []);

  const applyDiscountCodeFn = useCallback((code: string): boolean => {
    try {
      const updatedCart = cartUtils.applyDiscountCode(cart, code);
      const discountApplied = updatedCart.discount > cart.discount;
      
      if (discountApplied) {
        setCart(updatedCart);
        setError(null);
      }
      
      return discountApplied;
    } catch (err) {
      console.error('Apply discount failed:', err);
      setError('Failed to apply discount code');
      return false;
    }
  }, [cart]);

  const clearCartFn = useCallback(() => {
    try {
      setCart(currentCart => cartUtils.clear(currentCart));
      setError(null);
    } catch (err) {
      console.error('Clear cart failed:', err);
      setError('Failed to clear cart');
    }
  }, []);

  const itemCount = cartUtils.getItemCount(cart);
  const isEmpty = cartUtils.isEmpty(cart);

  return {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    applyDiscountCode: applyDiscountCodeFn,
    clearCart: clearCartFn,
    itemCount,
    isEmpty,
    isLoading,
    error
  };
};
