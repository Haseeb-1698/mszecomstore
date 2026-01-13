import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useSupabaseAuth();

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
    }
    
    if (!loading && user && requireAdmin && !isAdmin) {
      window.location.href = '/dashboard';
    }
  }, [user, loading, requireAdmin, isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!user || (requireAdmin && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
}