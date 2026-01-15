import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { isUserAdmin } from '../lib/api/users';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isReady: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  /** True if there was an error during initialization */
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SupabaseAuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Track if we've already completed initialization
  const initCompleted = useRef(false);

  // Check admin status from user_profiles table - non-blocking
  const checkAdminStatus = useCallback(async (userId: string | undefined): Promise<boolean> => {
    if (!userId) {
      return false;
    }
    
    try {
      const adminStatus = await isUserAdmin(userId);
      return adminStatus;
    } catch (error) {
      console.warn('Error checking admin status, defaulting to false:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initAuth = async () => {
      try {
        // Skip on server-side
        if (typeof window === 'undefined') {
          initCompleted.current = true;
          setLoading(false);
          setIsReady(true);
          return;
        }
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted || initCompleted.current) return;

        if (error) {
          console.error('Error getting session:', error);
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setAuthError(error.message);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
          
          // Check admin status - but DON'T block ready state on it
          // Set ready first, then update admin status when it comes back
          if (session?.user?.id) {
            // Fire and forget - don't await
            checkAdminStatus(session.user.id).then(adminStatus => {
              if (mounted) {
                setIsAdmin(adminStatus);
              }
            });
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted && !initCompleted.current) {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setAuthError(error instanceof Error ? error.message : 'Auth initialization failed');
        }
      } finally {
        if (mounted && !initCompleted.current) {
          initCompleted.current = true;
          setLoading(false);
          setIsReady(true);
          console.log('[SupabaseAuth] Initialization complete, isReady set to true');
        }
      }
    };

    initAuth();

    // Listen for auth changes
    // Skip INITIAL_SESSION as it's already handled by initAuth() above
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      // Skip INITIAL_SESSION - already handled in initAuth()
      if (event === 'INITIAL_SESSION') {
        return;
      }
      
      console.log('[SupabaseAuth] State changed:', event, 'userId:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setAuthError(null); // Clear any previous errors on successful auth change
      
      // Update admin status asynchronously
      if (session?.user?.id) {
        checkAdminStatus(session.user.id).then(adminStatus => {
          if (mounted) {
            setIsAdmin(adminStatus);
          }
        });
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkAdminStatus]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      const err = error as Error;
      return { error: err };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { error };
    } catch (error) {
      const err = error as Error;
      return { error: err };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }, []);

  const value = useMemo(() => ({
    user,
    session,
    loading,
    isReady,
    signIn,
    signUp,
    signOut,
    isAdmin,
    authError
  }), [user, session, loading, isReady, signIn, signUp, signOut, isAdmin, authError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within SupabaseAuthProvider');
  }
  return context;
}
