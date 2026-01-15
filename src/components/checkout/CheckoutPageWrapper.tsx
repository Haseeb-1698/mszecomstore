import React from 'react';
import { AppProviders } from '../../providers/AppProviders';
import CheckoutPage from './CheckoutPage';

/**
 * CheckoutPageWrapper - Wraps CheckoutPage with necessary providers
 *
 * This ensures CheckoutPage is properly hydrated within the React component tree
 * and can access CartContext and SupabaseAuthContext.
 *
 * IMPORTANT: This wrapper is necessary because Astro's client:only directive
 * doesn't properly hydrate JSX children passed from .astro files. By wrapping
 * both the providers and the page component in a single React component,
 * we ensure they're all part of the same React tree.
 */
const CheckoutPageWrapper: React.FC = () => {
  return (
    <AppProviders includeCart={true}>
      <CheckoutPage />
    </AppProviders>
  );
};

export default CheckoutPageWrapper;
