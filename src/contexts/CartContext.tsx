import React, { createContext, useContext, type ReactNode } from 'react';
import { useCart, type UseCartReturn } from '../hooks/useCart';

const CartContext = createContext<UseCartReturn | undefined>(undefined);

export interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const cartValue = useCart();

  return (
    <CartContext.Provider value={cartValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = (): UseCartReturn => {
  const context = useContext(CartContext);
  if (context === undefined) {
    // During hydration or if provider not mounted, return a loading state with async no-ops
    return {
      cart: null,
      addItem: async () => {},
      removeItem: async () => {},
      updateQuantity: async () => {},
      applyDiscountCode: async () => false,
      clearCart: async () => {},
      itemCount: 0,
      isEmpty: true,
      isLoading: true,
      error: null,
      isAuthenticated: false,
    };
  }
  return context;
};

// Export the context for advanced use cases
export { CartContext };
