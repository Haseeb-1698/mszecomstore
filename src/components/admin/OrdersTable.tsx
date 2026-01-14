import React, { useState, useEffect, useRef } from 'react';
import { OrderStatusBadge } from '../ui/StatusBadge';
import { supabase } from '../../lib/supabase';
import type { OrderStatus } from '../../lib/database.types';
import { formatPrice } from '../../lib/utils';
import { withTimeout, DEFAULT_QUERY_TIMEOUT } from '../../lib/utils/timeout';

interface Order {
  id: string;
  customer: string;
  email: string;
  whatsapp: string;
  service: string;
  amount: string;
  status: OrderStatus;
  date: string;
}

const OrdersTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ordersPerPage = 10;
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    fetchOrders();
    
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: queryError } = await withTimeout(
        supabase
          .from('orders')
          .select(`
            *,
            items:order_items (service_name, plan_name)
          `)
          .order('created_at', { ascending: false }),
        DEFAULT_QUERY_TIMEOUT,
        'Orders fetch timed out'
      );

      if (!mountedRef.current) return;

      if (queryError) {
        setError(queryError.message);
        return;
      }

      const mappedOrders: Order[] = (data || []).map((order: any) => ({
        id: order.id.substring(0, 8).toUpperCase(),
        customer: order.customer_name || 'Unknown',
        email: order.customer_email || '',
        whatsapp: order.customer_whatsapp || '',
        service: order.items?.[0]?.service_name || 'N/A',
        amount: formatPrice(order.amount),
        status: order.status as OrderStatus,
        date: new Date(order.created_at).toLocaleDateString()
      }));

      setOrders(mappedOrders);
    } catch (err: unknown) {
      console.error('Error fetching orders:', err);
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to load orders');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      // Find the full order ID from the truncated display ID
      const { data } = await supabase
        .from('orders')
        .select('id')
        .ilike('id', `${orderId.toLowerCase()}%`)
        .single();
      
      if (!data) return;

      const updateData: any = { status: newStatus };
      if (newStatus === 'delivered') {
        updateData.delivered_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', data.id);

      if (error) throw error;
      
      // Refresh orders
      fetchOrders();
    } catch (err: any) {
      console.error('Error updating order status:', err);
    }
  };

  if (loading) {
    return (
      <div className="bg-cream-50 dark:bg-charcoal-800 rounded-2xl border border-cream-400 dark:border-charcoal-700 p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-500 mx-auto"></div>
        <p className="mt-4 text-charcoal-600 dark:text-cream-400">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-cream-50 dark:bg-charcoal-800 rounded-2xl border border-cream-400 dark:border-charcoal-700 p-8 text-center">
        <svg className="w-12 h-12 mx-auto text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-charcoal-600 dark:text-cream-400 mb-4">{error}</p>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-coral-500 hover:bg-coral-600 text-white rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-cream-50 dark:bg-charcoal-800 rounded-2xl border border-cream-400 dark:border-charcoal-700 p-8 text-center">
        <svg className="w-12 h-12 mx-auto text-charcoal-400 dark:text-cream-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-charcoal-600 dark:text-cream-400">No orders yet</p>
      </div>
    );
  }

  return (
    <div className="bg-cream-50 dark:bg-charcoal-800 rounded-2xl border border-cream-400 dark:border-charcoal-700 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-cream-200 dark:bg-charcoal-900">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-charcoal-700 dark:text-cream-300">Order ID</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-charcoal-700 dark:text-cream-300">Customer</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-charcoal-700 dark:text-cream-300">Service</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-charcoal-700 dark:text-cream-300">Amount</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-charcoal-700 dark:text-cream-300">Status</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-charcoal-700 dark:text-cream-300">Date</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-charcoal-700 dark:text-cream-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order, index) => (
              <tr
                key={order.id}
                className={`border-t border-cream-400 dark:border-charcoal-700 hover:bg-cream-100 dark:hover:bg-charcoal-700 transition-colors ${index % 2 === 0 ? 'bg-cream-50 dark:bg-charcoal-800' : 'bg-cream-100 dark:bg-charcoal-900'
                  }`}
              >
                <td className="py-4 px-6">
                  <a
                    href={`/order/${order.id}`}
                    className="text-sm font-medium text-coral-600 hover:text-coral-700 dark:text-coral-400 hover:underline"
                  >
                    {order.id}
                  </a>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <p className="text-sm font-medium text-charcoal-800 dark:text-cream-100">{order.customer}</p>
                    <p className="text-xs text-charcoal-600 dark:text-cream-400">{order.email}</p>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-charcoal-700 dark:text-cream-300">{order.service}</td>
                <td className="py-4 px-6 text-sm font-semibold text-charcoal-800 dark:text-cream-100">{order.amount}</td>
                <td className="py-4 px-6">
                  <OrderStatusBadge status={order.status} showIcon />
                </td>
                <td className="py-4 px-6 text-sm text-charcoal-600 dark:text-cream-400">{order.date}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 rounded-lg hover:bg-cream-200 dark:hover:bg-charcoal-600 text-charcoal-700 dark:text-cream-300 transition-colors"
                      title="View details"
                      onClick={() => globalThis.location.href = `/order/${order.id}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="text-xs px-2 py-1 bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-700 rounded-lg text-charcoal-700 dark:text-cream-300 focus:outline-none focus:ring-2 focus:ring-coral-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-cream-200 dark:bg-charcoal-900 px-6 py-4 flex items-center justify-between">
        <p className="text-sm text-charcoal-600 dark:text-cream-400">
          Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, orders.length)} of {orders.length} orders
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border border-cream-400 dark:border-charcoal-700 text-charcoal-700 dark:text-cream-300 hover:bg-cream-100 dark:hover:bg-charcoal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-charcoal-700 dark:text-cream-300">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-2 rounded-lg border border-cream-400 dark:border-charcoal-700 text-charcoal-700 dark:text-cream-300 hover:bg-cream-100 dark:hover:bg-charcoal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;
