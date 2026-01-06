import React, { useState } from 'react';
import OrderStatusBadge from './OrderStatusBadge';

interface Order {
  id: string;
  customer: string;
  email: string;
  service: string;
  amount: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: string;
  paymentMethod: string;
}

const OrdersTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const mockOrders: Order[] = [
    {
      id: 'ORD-001',
      customer: 'John Doe',
      email: 'john@example.com',
      service: 'Netflix Premium',
      amount: '$15.99',
      status: 'completed',
      date: '2024-01-15',
      paymentMethod: 'EasyPaisa'
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      service: 'Spotify Individual',
      amount: '$9.99',
      status: 'processing',
      date: '2024-01-15',
      paymentMethod: 'JazzCash'
    },
    {
      id: 'ORD-003',
      customer: 'Bob Johnson',
      email: 'bob@example.com',
      service: 'YouTube Premium',
      amount: '$11.99',
      status: 'pending',
      date: '2024-01-14',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 'ORD-004',
      customer: 'Alice Williams',
      email: 'alice@example.com',
      service: 'Disney+ Hotstar',
      amount: '$7.99',
      status: 'completed',
      date: '2024-01-14',
      paymentMethod: 'EasyPaisa'
    },
    {
      id: 'ORD-005',
      customer: 'Charlie Brown',
      email: 'charlie@example.com',
      service: 'Amazon Prime',
      amount: '$12.99',
      status: 'cancelled',
      date: '2024-01-13',
      paymentMethod: 'JazzCash'
    },
    {
      id: 'ORD-006',
      customer: 'Diana Prince',
      email: 'diana@example.com',
      service: 'HBO Max',
      amount: '$14.99',
      status: 'completed',
      date: '2024-01-13',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 'ORD-007',
      customer: 'Bruce Wayne',
      email: 'bruce@example.com',
      service: 'Apple Music',
      amount: '$9.99',
      status: 'processing',
      date: '2024-01-12',
      paymentMethod: 'EasyPaisa'
    },
    {
      id: 'ORD-008',
      customer: 'Clark Kent',
      email: 'clark@example.com',
      service: 'Netflix Premium',
      amount: '$15.99',
      status: 'completed',
      date: '2024-01-12',
      paymentMethod: 'JazzCash'
    },
    {
      id: 'ORD-009',
      customer: 'Peter Parker',
      email: 'peter@example.com',
      service: 'Spotify Family',
      amount: '$14.99',
      status: 'pending',
      date: '2024-01-11',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 'ORD-010',
      customer: 'Tony Stark',
      email: 'tony@example.com',
      service: 'YouTube Premium',
      amount: '$11.99',
      status: 'completed',
      date: '2024-01-11',
      paymentMethod: 'EasyPaisa'
    }
  ];

  const totalPages = Math.ceil(mockOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = mockOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
    // In a real app, this would make an API call
  };

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
                className={`border-t border-cream-400 dark:border-charcoal-700 hover:bg-cream-100 dark:hover:bg-charcoal-700 transition-colors ${
                  index % 2 === 0 ? 'bg-cream-50 dark:bg-charcoal-800' : 'bg-cream-100 dark:bg-charcoal-750'
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
                      onClick={() => window.location.href = `/order/${order.id}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                      className="text-xs px-2 py-1 bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-700 rounded-lg text-charcoal-700 dark:text-cream-300 focus:outline-none focus:ring-2 focus:ring-coral-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
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
          Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, mockOrders.length)} of {mockOrders.length} orders
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
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
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
