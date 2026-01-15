/**
 * CartContext - Single source of truth for cart state
 * 
 * ARCHITECTURE RULES:
 * 1. ALL cart-consuming components inside AppProviders MUST use useCartContext()
 * 2. NEVER import useCart directly in components - always use useCartContext()
 * 3. For components outside AppProviders (e.g., Header), use CartIconStandalone
 * 
 * This ensures a single cart instance is shared across the component tree,
 * preventing duplicate API calls and state sync issues.
 */

import React, { createContext, useContext, type ReactNode } from 'react';
import { useCart, type UseCartReturn } from '../hooks/useCart';

// Default values for SSR/non-provider contexts
const defaultCartValue: UseCartReturn = {
  cart: null,
  addItem: async () => {},
  removeItem: async () => {},
  updateQuantity: async () => {},
  applyDiscountCode: async () => false,
  clearCart: async () => {},
  refreshCart: async () => {},
  itemCount: 0,
  isEmpty: true,
  isLoading: true,
  error: null,
  isAuthenticated: false
};

const CartContext = createContext<UseCartReturn>(defaultCartValue);

export interface CartProviderProps {
  children: ReactNode;
}

/**
 * CartProvider - Wraps the app with cart state
 * Must be nested inside SupabaseAuthProvider for auth context access
 */
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const cartValue = useCart();

  return (
    <CartContext.Provider value={cartValue}>
      {children}
    </CartContext.Provider>
  );
};

/**
 * useCartContext - Access cart state from context
 * 
 * Returns default loading state if used outside CartProvider (safe for SSR)
 * 
 * @returns Cart state and operations
 * 
 * @example
 * // In a component inside AppProviders:
 * const { cart, addItem, isLoading } = useCartContext();
 */
export const useCartContext = (): UseCartReturn => {
  return useContext(CartContext);
};

// Re-export types for convenience
export type { UseCartReturn } from '../hooks/useCart';

// Export the context for testing/advanced use cases
export { CartContext };
