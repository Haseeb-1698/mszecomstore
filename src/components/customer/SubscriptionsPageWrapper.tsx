import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import AllSubscriptionsPage from './AllSubscriptionsPage';

export const SubscriptionsPageWrapper: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
        }
        return;
      }
      
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-cream-50 dark:bg-charcoal-900'>
        <LoadingSpinner size='large' />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <AllSubscriptionsPage />;
};

export default SubscriptionsPageWrapper;
