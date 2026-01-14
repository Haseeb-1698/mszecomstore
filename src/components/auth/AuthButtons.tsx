import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import CartIcon from '../ui/CartIcon';

/**
 * AuthButtons component - displays login/signup or profile icon based on auth state.
 * This component does NOT use React context to avoid hydration issues in Astro.
 * It directly subscribes to Supabase auth state.
 */
const AuthButtons: React.FC = () => {
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.email === 'umerfarooq1105@gmail.com');
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Show skeleton during loading to prevent layout shift
  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-16 h-8 bg-cream-200 dark:bg-charcoal-700 rounded-lg animate-pulse"></div>
        <div className="w-20 h-10 bg-cream-200 dark:bg-charcoal-700 rounded-full animate-pulse"></div>
      </div>
    );
  }

  // User is logged in - show cart icon, profile icon, and admin icon (if admin)
  if (user) {
    return (
      <div className="flex items-center gap-2">
        {/* Cart Icon */}
        <CartIcon />
        
        {/* Admin Icon - only show if user is admin */}
        {isAdmin && (
          <a 
            href="/admin" 
            className="relative inline-flex items-center justify-center p-2 rounded-lg hover:bg-cream-200 dark:hover:bg-charcoal-800 transition-colors group" 
            title="Admin Panel"
          >
            <svg className="w-6 h-6 text-charcoal-800 dark:text-cream-100 group-hover:text-coral-500 dark:group-hover:text-coral-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </a>
        )}
        
        {/* Profile Icon */}
        <a 
          href="/dashboard" 
          className="relative inline-flex items-center justify-center p-2 rounded-lg hover:bg-cream-200 dark:hover:bg-charcoal-800 transition-colors group" 
          title="My Dashboard"
        >
          <svg className="w-6 h-6 text-charcoal-800 dark:text-cream-100 group-hover:text-coral-500 dark:group-hover:text-coral-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </a>
      </div>
    );
  }

  // User is not logged in - show login/signup buttons
  return (
    <div className="flex items-center gap-4">
      <a 
        href="/login" 
        className="text-charcoal-800 dark:text-cream-100 hover:text-coral-500 dark:hover:text-coral-400 transition-colors font-medium"
      >
        Log In
      </a>
      <a 
        href="/signup" 
        className="px-5 py-2 rounded-full bg-coral-500 text-white font-medium hover:bg-coral-600 transition-all shadow-soft hover:shadow-soft-lg"
      >
        Sign Up
      </a>
    </div>
  );
};

export default AuthButtons;
