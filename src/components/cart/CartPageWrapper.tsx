import React from 'react';
import { CartProvider } from '../../contexts/CartContext';
import CartPage from './CartPage';

const CartPageWrapper: React.FC = () => {
  return (
    <CartProvider>
      <CartPage />
    </CartProvider>
  );
};

export default CartPageWrapper;