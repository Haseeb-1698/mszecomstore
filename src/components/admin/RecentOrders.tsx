import React from 'react';

interface Order {
  id: string;
  customer: string;
  service: string;
  amount: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: string;
}

export default function RecentOrders() {
  const orders: Order[] = [
    {
      id: 'ORD-001',
      customer: 'John Doe',
      service: 'Netflix Premium',
      amount: '$15.99',
      status: 'completed',
      date: '2024-01-15'
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      service: 'Spotify Individual',
      amount: '$9.99',
      status: 'processing',
      date: '2024-01-15'
    },
    {
      id: 'ORD-003',
      customer: 'Bob Johnson',
      service: 'YouTube Premium',
      amount: '$11.99',
      status: 'pending',
      date: '2024-01-14'
    },
    {
      id: 'ORD-004',
      customer: 'Alice Williams',
      service: 'Disney+ Hotstar',
      amount: '$7.99',
      status: 'completed',
      date: '2024-01-14'
    },
    {
      id: 'ORD-005',
      customer: 'Charlie Brown',
      service: 'Amazon Prime',
      amount: '$12.99',
      status: 'cancelled',
      date: '2024-01-13'
    }
  ];

  const getStatusBadge = (status: Order['status']) => {
    const styles = {
      completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      processing: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

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
                    href={`/admin/orders/${order.id}`}
                    className="text-sm font-medium text-coral-600 hover:text-coral-700 dark:text-coral-400"
                  >
                    {order.id}
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
    </div>
  );
}
