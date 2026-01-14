import React from 'react';
import type { DbOrder } from '../../lib/database.types';

interface RecentOrdersProps {
  orders: any[];
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-700 dark:text-yellow-400',
        label: 'Pending',
      },
      confirmed: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-400',
        label: 'Confirmed',
      },
      processing: {
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        text: 'text-purple-700 dark:text-purple-400',
        label: 'Processing',
      },
      delivered: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-400',
        label: 'Delivered',
      },
      cancelled: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-400',
        label: 'Cancelled',
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span className={`px-3 py-1 text-xs font-medium ${config.bg} ${config.text} rounded-full`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return `Rs ${price.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="bg-cream-100 dark:bg-charcoal-800 rounded-2xl border border-cream-300 dark:border-charcoal-700 overflow-hidden">
      <div className="p-6 border-b border-cream-300 dark:border-charcoal-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-charcoal-900 dark:text-cream-50 mb-1">
              Recent Orders
            </h2>
            <p className="text-sm text-charcoal-600 dark:text-cream-300">
              Your last {orders.length} order{orders.length !== 1 ? 's' : ''}
            </p>
          </div>
          <a
            href="/orders"
            className="text-sm font-medium text-coral-600 dark:text-coral-400 hover:text-coral-700 dark:hover:text-coral-500 transition-colors"
          >
            View all →
          </a>
        </div>
      </div>

      <div className="p-6">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-cream-200 dark:bg-charcoal-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-charcoal-400 dark:text-cream-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-charcoal-900 dark:text-cream-50 mb-2">
              No orders yet
            </h3>
            <p className="text-charcoal-600 dark:text-cream-300 mb-4">
              Browse our services and place your first order
            </p>
            <a
              href="/services"
              className="inline-block px-6 py-2 bg-coral-500 hover:bg-coral-600 dark:bg-coral-600 dark:hover:bg-coral-700 text-white rounded-lg font-medium transition-colors"
            >
              Browse Services
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cream-300 dark:border-charcoal-700">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-charcoal-600 dark:text-cream-300 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-charcoal-600 dark:text-cream-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-charcoal-600 dark:text-cream-300 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-charcoal-600 dark:text-cream-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-charcoal-600 dark:text-cream-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-charcoal-600 dark:text-cream-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-cream-200 dark:border-charcoal-700 hover:bg-cream-50 dark:hover:bg-charcoal-750 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm text-charcoal-900 dark:text-cream-50">
                        #{order.id.slice(0, 8)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-charcoal-700 dark:text-cream-200">
                        {formatDate(order.created_at)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-charcoal-700 dark:text-cream-200">
                        {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-semibold text-charcoal-900 dark:text-cream-50">
                        {formatPrice(Number(order.amount))}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <a
                        href={`/order/${order.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-coral-600 dark:text-coral-400 hover:text-coral-700 dark:hover:text-coral-500 transition-colors"
                      >
                        View
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
        )}
      </div>
    </div>
  );
};

export default RecentOrders;
