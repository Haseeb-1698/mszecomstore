import React, { type ReactNode } from 'react';
import { SupabaseAuthProvider } from '../../contexts/SupabaseAuthContext';

interface AdminProvidersProps {
  children: ReactNode;
}

/**
 * AdminProviders - Centralized provider wrapper for admin pages.
 * This prevents multiple provider instances and hydration race conditions.
 * All admin components should use this single provider instead of wrapping themselves.
 */
export const AdminProviders: React.FC<AdminProvidersProps> = ({ children }) => {
  return (
    <SupabaseAuthProvider>
      {children}
    </SupabaseAuthProvider>
  );
};

export default AdminProviders;
