import React, { useState, useEffect, useRef } from 'react';
import StatsCard from './StatsCard';
import { supabase } from '../../lib/supabase';
import { withTimeout, DEFAULT_QUERY_TIMEOUT } from '../../lib/utils/timeout';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  activeSubscriptions: number;
  totalServices: number;
  pendingOrders: number;
  deliveredToday: number;
}

interface RpcDashboardStats {
  total_revenue: number;
  pending_orders: number;
  processing_orders: number;
  completed_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  total_orders: number;
  active_customers: number;
  delivered_today: number;
  revenue_today: number;
  active_subscriptions: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    totalServices: 0,
    pendingOrders: 0,
    deliveredToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    fetchStats();
    
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Run all queries in parallel with individual timeouts
      const [dashboardResult, servicesResult] = await Promise.allSettled([
        // Dashboard stats RPC (now includes everything)
        withTimeout(
          supabase.rpc('get_admin_dashboard_stats'),
          DEFAULT_QUERY_TIMEOUT,
          'Dashboard stats timed out'
        ),
        // Services count
        withTimeout(
          supabase.from('services').select('*', { count: 'exact', head: true }).eq('is_active', true),
          DEFAULT_QUERY_TIMEOUT,
          'Services count timed out'
        ),
      ]);

      if (!mountedRef.current) return;

      // Extract results, handling failures gracefully
      let dbStats: RpcDashboardStats | undefined;
      let servicesCount = 0;

      if (dashboardResult.status === 'fulfilled' && !dashboardResult.value.error) {
        dbStats = (dashboardResult.value.data as RpcDashboardStats[] | null)?.[0];
      } else {
        console.warn('Dashboard stats failed:', dashboardResult.status === 'rejected' ? dashboardResult.reason : dashboardResult.value.error);
      }

      if (servicesResult.status === 'fulfilled' && !servicesResult.value.error) {
        servicesCount = servicesResult.value.count || 0;
      } else {
        console.warn('Services count failed:', servicesResult.status === 'rejected' ? servicesResult.reason : servicesResult.value.error);
      }

      setStats({
        totalOrders: dbStats?.total_orders || 0,
        totalRevenue: dbStats?.total_revenue || 0,
        activeSubscriptions: dbStats?.active_subscriptions || 0,
        totalServices: servicesCount,
        pendingOrders: dbStats?.pending_orders || 0,
        deliveredToday: dbStats?.delivered_today || 0
      });
    } catch (err: unknown) {
      console.error('Error fetching stats:', err);
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard stats');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  const formatCurrency = (value: number) => {
    return `Rs ${value.toLocaleString('en-PK')}`;
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-cream-50 dark:bg-charcoal-800 rounded-2xl p-6 border border-cream-400 dark:border-charcoal-700 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-cream-200 dark:bg-charcoal-700 rounded-xl"></div>
              <div className="w-16 h-6 bg-cream-200 dark:bg-charcoal-700 rounded-lg"></div>
            </div>
            <div className="space-y-2">
              <div className="w-24 h-4 bg-cream-200 dark:bg-charcoal-700 rounded"></div>
              <div className="w-20 h-8 bg-cream-200 dark:bg-charcoal-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-medium text-red-800 dark:text-red-200">Failed to load dashboard</p>
            <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
          </div>
          <button
            onClick={fetchStats}
            className="ml-auto px-4 py-2 bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 text-red-700 dark:text-red-100 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <StatsCard
        title="Total Orders"
        value={stats.totalOrders.toString()}
        change={stats.pendingOrders > 0 ? `${stats.pendingOrders} pending` : 'No pending'}
        trend="up"
        icon="orders"
      />
      <StatsCard
        title="Revenue"
        value={formatCurrency(stats.totalRevenue)}
        change={stats.deliveredToday > 0 ? `${stats.deliveredToday} today` : 'No deliveries'}
        trend="up"
        icon="revenue"
      />
      <StatsCard
        title="Active Subscriptions"
        value={stats.activeSubscriptions.toString()}
        change="+0%"
        trend="up"
        icon="customers"
      />
      <StatsCard
        title="Services"
        value={stats.totalServices.toString()}
        change="Active"
        trend="up"
        icon="services"
      />
    </div>
  );
};

export default AdminDashboard;
