import React, { createContext, useContext, type ReactNode } from 'react';
import { useCart, type UseCartReturn } from '../hooks/useCart';
import { cartUtils } from '../lib/cart';

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
    // During hydration or if provider not mounted, return a loading state
    return {
      cart: cartUtils.create(),
      addItem: () => {},
      removeItem: () => {},
      updateQuantity: () => {},
      applyDiscountCode: () => false,
      clearCart: () => {},
      itemCount: 0,
      isEmpty: true,
      isLoading: true,
      error: null,
    };
  }
  return context;
};

// Export the context for advanced use cases
export { CartContext };
