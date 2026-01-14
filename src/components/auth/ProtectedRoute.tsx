import React, { useEffect } from 'react';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

/**
 * ProtectedRoute - Uses the SupabaseAuthContext for auth state.
 * Must be used within SupabaseAuthProvider (via AdminProviders/AdminShell).
 */
export function ProtectedRoute({ children, requireAdmin = false }: Readonly<ProtectedRouteProps>) {
  const { user, loading, isAdmin } = useSupabaseAuth();

  // Handle redirects after auth state is determined
  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in - redirect to login
        globalThis.location.href = '/login?redirect=' + encodeURIComponent(globalThis.location.pathname);
      } else if (requireAdmin && !isAdmin) {
        // Not admin but admin required - redirect to dashboard
        globalThis.location.href = '/dashboard';
      }
    }
  }, [user, loading, requireAdmin, isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50 dark:bg-charcoal-900">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!user || (requireAdmin && !isAdmin)) {
    // Return null while redirecting
    return null;
  }

  return <>{children}</>;
}