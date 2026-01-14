import React, { useState, useEffect } from 'react';
import StatsCard from './StatsCard';
import { supabase } from '../../lib/supabase';

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
  active_customers: number;
  delivered_today: number;
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

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch dashboard stats using the RPC function
      // Note: Type assertion needed as RPC function types aren't in generated types
      const { data: dashboardStats, error: statsError } = await supabase
        .rpc('get_admin_dashboard_stats');

      if (statsError) {
        console.error('Error fetching dashboard stats:', statsError);
      }

      // Fetch total orders count
      const { count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Fetch active services count
      const { count: servicesCount } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Fetch active subscriptions count
      const { count: subscriptionsCount } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      const dbStats = (dashboardStats as RpcDashboardStats[] | null)?.[0];

      setStats({
        totalOrders: ordersCount || 0,
        totalRevenue: dbStats?.total_revenue || 0,
        activeSubscriptions: subscriptionsCount || 0,
        totalServices: servicesCount || 0,
        pendingOrders: dbStats?.pending_orders || 0,
        deliveredToday: dbStats?.delivered_today || 0
      });
    } catch (err: any) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
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
