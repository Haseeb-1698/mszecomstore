import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import type { User } from '@supabase/supabase-js';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

/**
 * ProtectedRoute - Self-contained protected route that doesn't rely on React context.
 * This avoids hydration issues with Astro's client:load directive.
 */
export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setIsAdmin(session?.user?.email === 'umerfarooq1105@gmail.com');
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.email === 'umerfarooq1105@gmail.com');
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle redirects after auth state is determined
  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in - redirect to login
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      } else if (requireAdmin && !isAdmin) {
        // Not admin but admin required - redirect to dashboard
        window.location.href = '/dashboard';
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