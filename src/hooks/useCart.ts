import { useState, useEffect, useCallback } from 'react';
import type { Cart } from '../lib/types';
import { cartUtils } from '../lib/cart';

export interface ItemData {
  serviceId: string;
  serviceName: string;
  planId: string;
  planName: string;
  price: number | string;
  quantity?: number;
}

export interface UseCartReturn {
  cart: Cart;
  addItem: (item: ItemData) => void;
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
      console.log('🛒 loadCart started');
      try {
        const savedCart = cartUtils.load();
        console.log('🛒 savedCart from storage:', savedCart);

        let cartToUse = cartUtils.create();
        console.log('🛒 empty cart created:', cartToUse);

        if (savedCart) {
          const validatedCart = cartUtils.validate(savedCart);
          console.log('🛒 validatedCart:', validatedCart);
          cartToUse = validatedCart;
        }

        setCart(cartToUse);
        console.log('🛒 setCart called');
        setError(null);
      } catch (err) {
        console.error('🛒 loadCart error:', err);
        setError('Failed to load your cart. Starting with an empty cart.');
        setCart(cartUtils.create());
      } finally {
        console.log('🛒 Setting isLoading to false');
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

  const addItem = useCallback((item: ItemData) => {
    try {
      setCart(currentCart => cartUtils.addItem(currentCart, item));
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
