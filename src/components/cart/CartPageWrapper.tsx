import React from 'react';
import { AppProviders } from '../../providers/AppProviders';
import CartPage from './CartPage';

/**
 * CartPageWrapper - Wraps CartPage with necessary providers
 *
 * This ensures CartPage is properly hydrated within the React component tree
 * and can access CartContext and SupabaseAuthContext.
 *
 * IMPORTANT: This wrapper is necessary because Astro's client:only directive
 * doesn't properly hydrate JSX children passed from .astro files. By wrapping
 * both the providers and the page component in a single React component,
 * we ensure they're all part of the same React tree.
 */
const CartPageWrapper: React.FC = () => {
  return (
    <AppProviders includeCart={true}>
      <CartPage />
    </AppProviders>
  );
};

export default CartPageWrapper;
