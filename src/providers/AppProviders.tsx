/**
 * AppProviders - Unified provider wrapper for customer-facing pages.
 * 
 * This component wraps customer pages with all necessary providers in the correct order:
 * 1. ErrorBoundary - Catches crashes and displays fallback UI
 * 2. QueryProvider - TanStack Query for data fetching/caching
 * 3. SupabaseAuthProvider - Authentication state management
 * 4. CartProvider - Shopping cart state management
 * 
 * Use this wrapper for customer pages that need cart and auth functionality.
 * For pages that only need auth (no cart), you can use SupabaseAuthProvider directly.
 * 
 * @example
 * // In your Astro page:
 * <AppProviders client:only="react">
 *   <CartPage />
 * </AppProviders>
 */

import React, { type ReactNode } from 'react';
import { QueryProvider } from './QueryProvider';
import { SupabaseAuthProvider } from '../contexts/SupabaseAuthContext';
import { CartProvider } from '../contexts/CartContext';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

interface AppProvidersProps {
  children: ReactNode;
  /**
   * Whether to include the CartProvider.
   * Set to false for pages that don't need cart functionality.
   * @default true
   */
  includeCart?: boolean;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ 
  children, 
  includeCart = true 
}) => {
  // Build provider tree based on what's needed
  // Order matters: ErrorBoundary > QueryProvider > SupabaseAuthProvider > CartProvider
  
  if (includeCart) {
    return (
      <ErrorBoundary>
        <QueryProvider>
          <SupabaseAuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </SupabaseAuthProvider>
        </QueryProvider>
      </ErrorBoundary>
    );
  }
  
  return (
    <ErrorBoundary>
      <QueryProvider>
        <SupabaseAuthProvider>
          {children}
        </SupabaseAuthProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
};

export default AppProviders;
