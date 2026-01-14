import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { OrderStatus } from '../../lib/database.types';
import { formatPrice } from '../../lib/utils';

interface Order {
  id: string;
  displayId: string;
  customer: string;
  service: string;
  amount: string;
  status: OrderStatus;
  date: string;
}

const RecentOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items (service_name, plan_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching recent orders:', error);
        throw error;
      }

      const mappedOrders: Order[] = (data || []).map((order: any) => ({
        id: order.id,
        displayId: order.id.substring(0, 8).toUpperCase(),
        customer: order.customer_name || 'Unknown',
        service: order.items?.[0]?.service_name || 'N/A',
        amount: formatPrice(order.amount),
        status: order.status as OrderStatus,
        date: new Date(order.created_at).toLocaleDateString()
      }));

      setOrders(mappedOrders);
    } catch (err: any) {
      console.error('Error in fetchRecentOrders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const styles: Record<OrderStatus, string> = {
      completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      delivered: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      processing: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-cream-50 dark:bg-charcoal-800 rounded-2xl p-6 border border-cream-400 dark:border-charcoal-700">
        <div className="flex items-center justify-between mb-6">
          <div className="w-32 h-6 bg-cream-200 dark:bg-charcoal-700 rounded animate-pulse"></div>
          <div className="w-20 h-4 bg-cream-200 dark:bg-charcoal-700 rounded animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-20 h-4 bg-cream-200 dark:bg-charcoal-700 rounded"></div>
              <div className="w-24 h-4 bg-cream-200 dark:bg-charcoal-700 rounded"></div>
              <div className="w-32 h-4 bg-cream-200 dark:bg-charcoal-700 rounded"></div>
              <div className="w-16 h-4 bg-cream-200 dark:bg-charcoal-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream-50 dark:bg-charcoal-800 rounded-2xl p-6 border border-cream-400 dark:border-charcoal-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-charcoal-800 dark:text-cream-100">Recent Orders</h2>
        <a
          href="/admin/orders"
          className="text-sm font-medium text-coral-600 hover:text-coral-700 dark:text-coral-400 dark:hover:text-coral-300 flex items-center gap-1"
        >
          View all
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 mx-auto text-charcoal-400 dark:text-cream-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-charcoal-600 dark:text-cream-400">No orders yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-400 dark:border-charcoal-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal-700 dark:text-cream-300">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal-700 dark:text-cream-300">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal-700 dark:text-cream-300">Service</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal-700 dark:text-cream-300">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal-700 dark:text-cream-300">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal-700 dark:text-cream-300">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-cream-400 dark:border-charcoal-700 hover:bg-cream-100 dark:hover:bg-charcoal-700 transition-colors"
                >
                  <td className="py-3 px-4">
                    <a
                      href={`/order/${order.id}`}
                      className="text-sm font-medium text-coral-600 hover:text-coral-700 dark:text-coral-400"
                    >
                      {order.displayId}
                    </a>
                  </td>
                  <td className="py-3 px-4 text-sm text-charcoal-700 dark:text-cream-300">{order.customer}</td>
                  <td className="py-3 px-4 text-sm text-charcoal-700 dark:text-cream-300">{order.service}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-charcoal-800 dark:text-cream-100">{order.amount}</td>
                  <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                  <td className="py-3 px-4 text-sm text-charcoal-600 dark:text-cream-400">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentOrders;
