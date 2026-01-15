import React, { useState, useEffect, useRef } from 'react';
import CustomerStatsCard from './CustomerStatsCard';
import ActiveSubscriptions from './ActiveSubscriptions';
import RecentOrders from './RecentOrders';
import ProfileOverview from './ProfileOverview';
import { supabase } from '../../lib/supabase';
import { withTimeout, DEFAULT_QUERY_TIMEOUT } from '../../lib/utils/timeout';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';

interface CustomerStats {
  activeSubscriptions: number;
  totalOrders: number;
  expiringSubscriptions: number;
  totalSpent: number;
}

const CustomerDashboard: React.FC = () => {
  // Use the auth context instead of making separate auth calls
  const { user, isReady, authError } = useSupabaseAuth();
  
  const [stats, setStats] = useState<CustomerStats>({
    activeSubscriptions: 0,
    totalOrders: 0,
    expiringSubscriptions: 0,
    totalSpent: 0
  });
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    dataFetchedRef.current = false;
    
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Fetch dashboard data when auth is ready and user exists
  useEffect(() => {
    if (isReady && user?.id && !dataFetchedRef.current) {
      dataFetchedRef.current = true;
      fetchDashboardData();
    } else if (isReady && !user) {
      // Auth is ready but no user - stop loading
      setLoading(false);
    }
  }, [isReady, user?.id]);

  // Handle auth errors from context
  useEffect(() => {
    if (authError && mountedRef.current) {
      setError(authError);
    }
  }, [authError]);

  const fetchDashboardData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch data in parallel with timeouts
      const [subsResult, ordersResult] = await Promise.allSettled([
        withTimeout(
          supabase
            .from('subscriptions')
            .select(`
              *,
              plan:plans (
                *,
                service:services (*)
              )
            `)
            .eq('user_id', user.id)
            .order('expires_at', { ascending: false }),
          DEFAULT_QUERY_TIMEOUT,
          'Subscriptions fetch timed out'
        ),
        withTimeout(
          supabase
            .from('orders')
            .select(`
              *,
              items:order_items (*)
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5),
          DEFAULT_QUERY_TIMEOUT,
          'Orders fetch timed out'
        ),
      ]);

      if (!mountedRef.current) return;

      // Extract results
      let subsData: any[] = [];
      let ordersData: any[] = [];

      if (subsResult.status === 'fulfilled' && !subsResult.value.error) {
        subsData = subsResult.value.data || [];
      } else {
        console.warn('Subscriptions fetch failed:', subsResult.status === 'rejected' ? subsResult.reason : subsResult.value.error);
      }

      if (ordersResult.status === 'fulfilled' && !ordersResult.value.error) {
        ordersData = ordersResult.value.data || [];
      } else {
        console.warn('Orders fetch failed:', ordersResult.status === 'rejected' ? ordersResult.reason : ordersResult.value.error);
      }

      // Calculate stats
      const activeSubs = subsData.filter(sub => sub.status === 'active');
      const expiringSoon = activeSubs.filter(sub => {
        const daysUntilExpiry = Math.floor(
          (new Date(sub.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
      });

      const totalSpent = ordersData.reduce((sum, order) => sum + Number(order.amount), 0);

      setStats({
        activeSubscriptions: activeSubs.length,
        totalOrders: ordersData.length,
        expiringSubscriptions: expiringSoon.length,
        totalSpent
      });

      setSubscriptions(subsData);
      setOrders(ordersData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  if (error && !loading) {
    return (
      <div className="min-h-screen bg-cream-50 dark:bg-charcoal-900 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => {
                dataFetchedRef.current = false;
                fetchDashboardData();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while auth is initializing or data is being fetched
  if (!isReady || loading) {
    return (
      <div className="min-h-screen bg-cream-50 dark:bg-charcoal-900 py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-cream-100 dark:bg-charcoal-800 rounded-2xl p-6 border border-cream-300 dark:border-charcoal-700 animate-pulse h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-charcoal-900 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal-900 dark:text-cream-50 mb-2">
            My Dashboard
          </h1>
          <p className="text-charcoal-600 dark:text-cream-300">
            Welcome back! Here&apos;s an overview of your account.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <CustomerStatsCard
            title="Active Subscriptions"
            value={stats.activeSubscriptions.toString()}
            icon="subscriptions"
            trend={stats.activeSubscriptions > 0 ? 'up' : 'neutral'}
            subtitle={`${stats.expiringSubscriptions} expiring soon`}
          />
          <CustomerStatsCard
            title="Total Orders"
            value={stats.totalOrders.toString()}
            icon="orders"
            trend="neutral"
            subtitle="All time"
          />
          <CustomerStatsCard
            title="Total Spent"
            value={`Rs ${stats.totalSpent.toLocaleString()}`}
            icon="spending"
            trend="neutral"
            subtitle="Lifetime value"
          />
          <CustomerStatsCard
            title="Quick Actions"
            value=""
            icon="actions"
            trend="neutral"
            subtitle=""
            isActionCard
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Active Subscriptions - Takes 2 columns */}
          <div className="lg:col-span-2">
            <ActiveSubscriptions subscriptions={subscriptions} onRefresh={fetchDashboardData} />
          </div>

          {/* Profile Overview - Takes 1 column */}
          <div>
            <ProfileOverview />
          </div>
        </div>

        {/* Recent Orders - Full Width */}
        <div className="mt-6">
          <RecentOrders orders={orders} />
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
