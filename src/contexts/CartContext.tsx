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
    throw new Error(
      'useCartContext must be used within a CartProvider. ' +
      'Wrap your component tree with <CartProvider> or use useCart() hook directly for standalone usage.'
    );
  }
  return context;
};

// Export the context for advanced use cases
export { CartContext };
