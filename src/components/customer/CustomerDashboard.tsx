import React, { useState, useEffect } from 'react';
import CustomerStatsCard from './CustomerStatsCard';
import ActiveSubscriptions from './ActiveSubscriptions';
import RecentOrders from './RecentOrders';
import ProfileOverview from './ProfileOverview';
import { supabase } from '../../lib/supabase';
import type { DbSubscription, DbOrder } from '../../lib/database.types';

interface CustomerStats {
  activeSubscriptions: number;
  totalOrders: number;
  expiringSubscriptions: number;
  totalSpent: number;
}

const CustomerDashboard: React.FC = () => {
  const [stats, setStats] = useState<CustomerStats>({
    activeSubscriptions: 0,
    totalOrders: 0,
    expiringSubscriptions: 0,
    totalSpent: 0
  });
  const [subscriptions, setSubscriptions] = useState<DbSubscription[]>([]);
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchDashboardData();
    }
  }, [userId]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
    }
  };

  const fetchDashboardData = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      // Fetch active subscriptions
      const { data: subsData, error: subsError } = await supabase
        .from('subscriptions')
        .select(`
          *,
          plan:plans (
            *,
            service:services (*)
          )
        `)
        .eq('user_id', userId)
        .order('expires_at', { ascending: false });

      if (subsError) throw subsError;

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (ordersError) throw ordersError;

      // Calculate stats
      const activeSubs = subsData?.filter(sub => sub.status === 'active') || [];
      const expiringSoon = activeSubs.filter(sub => {
        const daysUntilExpiry = Math.floor(
          (new Date(sub.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
      });

      const totalSpent = ordersData?.reduce((sum, order) => sum + Number(order.amount), 0) || 0;

      setStats({
        activeSubscriptions: activeSubs.length,
        totalOrders: ordersData?.length || 0,
        expiringSubscriptions: expiringSoon.length,
        totalSpent
      });

      setSubscriptions(subsData as any || []);
      setOrders(ordersData as any || []);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
      <div className="container mx-auto px-4">
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
