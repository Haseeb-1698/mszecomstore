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
 * Waits for auth to be ready before rendering or redirecting.
 */
export function ProtectedRoute({ children, requireAdmin = false }: Readonly<ProtectedRouteProps>) {
  const { user, isReady, isAdmin, authError } = useSupabaseAuth();

  // Handle redirects after auth state is determined
  useEffect(() => {
    if (isReady && !authError) {
      if (!user) {
        // Not logged in - redirect to login
        globalThis.location.href = '/login?redirect=' + encodeURIComponent(globalThis.location.pathname);
      } else if (requireAdmin && !isAdmin) {
        // Not admin but admin required - redirect to dashboard
        globalThis.location.href = '/dashboard';
      }
    }
  }, [user, isReady, requireAdmin, isAdmin, authError]);

  // Show loading spinner while auth is initializing
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50 dark:bg-charcoal-900">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Show error state if auth initialization failed
  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50 dark:bg-charcoal-900">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">
            Authentication Error
          </h2>
          <p className="text-red-600 dark:text-red-300 mb-4">{authError}</p>
          <button
            onClick={() => globalThis.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Auth is ready but user not authenticated or not admin
  if (!user || (requireAdmin && !isAdmin)) {
    // Return null while redirecting
    return null;
  }

  // Auth ready and user authorized - render children
  return <>{children}</>;
}