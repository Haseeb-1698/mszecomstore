import React, { type ReactNode } from 'react';
import { QueryProvider } from '../../providers/QueryProvider';
import { SupabaseAuthProvider } from '../../contexts/SupabaseAuthContext';
import { ErrorBoundary } from '../ui/ErrorBoundary';

interface AdminProvidersProps {
  children: ReactNode;
}

/**
 * AdminProviders - Centralized provider wrapper for admin pages.
 * This prevents multiple provider instances and hydration race conditions.
 * All admin components should use this single provider instead of wrapping themselves.
 * 
 * Provider hierarchy (outermost to innermost):
 * 1. ErrorBoundary - Catches crashes and displays fallback UI
 * 2. QueryProvider - TanStack Query for data fetching/caching
 * 3. SupabaseAuthProvider - Authentication state management
 */
export const AdminProviders: React.FC<AdminProvidersProps> = ({ children }) => {
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

export default AdminProviders;
