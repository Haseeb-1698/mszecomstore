import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { OrderStatusBadge } from '../ui/StatusBadge';
import { formatDateTime, formatPriceWithDecimals } from '../../lib/utils';

const AllOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      let query = supabase
        .from('orders')
        .select(`
          *,
          items:order_items (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter as 'pending' | 'processing' | 'completed' | 'cancelled' | 'delivered');
      }

      const { data, error } = await query;

      if (error) throw error;

      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-charcoal-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <a
              href="/dashboard"
              className="p-2 hover:bg-cream-200 dark:hover:bg-charcoal-800 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-charcoal-600 dark:text-cream-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </a>
            <div>
              <h1 className="text-4xl font-bold text-charcoal-900 dark:text-cream-50 mb-2">
                My Orders
              </h1>
              <p className="text-charcoal-600 dark:text-cream-300">
                View and track all your orders
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'all', label: 'All Orders' },
              { value: 'pending', label: 'Pending' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'processing', label: 'Processing' },
              { value: 'delivered', label: 'Delivered' },
              { value: 'cancelled', label: 'Cancelled' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === tab.value
                    ? 'bg-coral-500 text-white dark:bg-coral-600'
                    : 'bg-cream-200 text-charcoal-700 hover:bg-cream-300 dark:bg-charcoal-800 dark:text-cream-200 dark:hover:bg-charcoal-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-cream-100 dark:bg-charcoal-800 rounded-2xl border border-cream-300 dark:border-charcoal-700 overflow-hidden">
          {(() => {
            if (loading) {
              return (
                <div className="p-8 text-center">
                  <div className="inline-block w-12 h-12 border-4 border-coral-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-charcoal-600 dark:text-cream-300">Loading orders...</p>
                </div>
              );
            }
            if (orders.length === 0) {
              return (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-cream-200 dark:bg-charcoal-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-charcoal-400 dark:text-cream-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-charcoal-900 dark:text-cream-50 mb-2">
                    No orders found
                  </h3>
                  <p className="text-charcoal-600 dark:text-cream-300 mb-6">
                    {filter === 'all' 
                      ? "You haven't placed any orders yet"
                      : `No ${filter} orders found`}
                  </p>
                  {filter === 'all' && (
                    <a
                      href="/services"
                      className="inline-block px-6 py-3 bg-coral-500 hover:bg-coral-600 dark:bg-coral-600 dark:hover:bg-coral-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Browse Services
                    </a>
                  )}
                </div>
              );
            }
            return (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cream-300 dark:border-charcoal-700 bg-cream-200 dark:bg-charcoal-750">
                    <th className="text-left py-4 px-6 text-xs font-semibold text-charcoal-700 dark:text-cream-200 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-charcoal-700 dark:text-cream-200 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-charcoal-700 dark:text-cream-200 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-charcoal-700 dark:text-cream-200 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-charcoal-700 dark:text-cream-200 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right py-4 px-6 text-xs font-semibold text-charcoal-700 dark:text-cream-200 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr
                      key={order.id}
                      className={`border-b border-cream-200 dark:border-charcoal-700 hover:bg-cream-50 dark:hover:bg-charcoal-750 transition-colors ${
                        index % 2 === 0 ? 'bg-white dark:bg-charcoal-800' : 'bg-cream-50 dark:bg-charcoal-750'
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-mono text-sm font-semibold text-charcoal-900 dark:text-cream-50 mb-1">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </p>
                          {order.customer_name && (
                            <p className="text-xs text-charcoal-600 dark:text-cream-300">
                              {order.customer_name}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-charcoal-700 dark:text-cream-200">
                          {formatDateTime(order.created_at)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-sm font-medium text-charcoal-900 dark:text-cream-50">
                            {order.items?.length || 0} item{order.items?.length === 1 ? '' : 's'}
                          </p>
                          {order.items && order.items.length > 0 && (
                            <p className="text-xs text-charcoal-600 dark:text-cream-300 mt-1">
                              {order.items[0].service_name}
                              {order.items.length > 1 && ` +${order.items.length - 1} more`}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-bold text-charcoal-900 dark:text-cream-50">
                          {formatPriceWithDecimals(Number(order.amount))}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <a
                          href={`/order/${order.id}`}
                          className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-coral-600 dark:text-coral-400 hover:bg-coral-50 dark:hover:bg-coral-900/20 rounded-lg transition-colors"
                        >
                          View Details
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            );
          })()}
        </div>

        {/* Stats Summary */}
        {!loading && orders.length > 0 && (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="bg-cream-100 dark:bg-charcoal-800 rounded-xl border border-cream-300 dark:border-charcoal-700 p-4">
              <p className="text-sm text-charcoal-600 dark:text-cream-300 mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-charcoal-900 dark:text-cream-50">{orders.length}</p>
            </div>
            <div className="bg-cream-100 dark:bg-charcoal-800 rounded-xl border border-cream-300 dark:border-charcoal-700 p-4">
              <p className="text-sm text-charcoal-600 dark:text-cream-300 mb-1">Total Items</p>
              <p className="text-2xl font-bold text-charcoal-900 dark:text-cream-50">
                {orders.reduce((sum, order) => sum + (order.items?.length || 0), 0)}
              </p>
            </div>
            <div className="bg-cream-100 dark:bg-charcoal-800 rounded-xl border border-cream-300 dark:border-charcoal-700 p-4">
              <p className="text-sm text-charcoal-600 dark:text-cream-300 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-charcoal-900 dark:text-cream-50">
                {formatPriceWithDecimals(orders.reduce((sum, order) => sum + Number(order.amount), 0))}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllOrdersPage;
