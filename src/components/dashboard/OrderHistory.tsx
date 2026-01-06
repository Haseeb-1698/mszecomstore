import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface Order {
  id: string;
  serviceName: string;
  date: Date;
  amount: number;
  status: 'delivered' | 'pending' | 'failed' | 'paid';
  paymentMethod: string;
}

interface OrderHistoryProps {
  orders: Order[];
}

export default function OrderHistory({ orders }: OrderHistoryProps) {
  const getStatusBadge = (status: string) => {
    const variants = {
      delivered: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
      pending: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
      failed: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
      paid: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${variants[status as keyof typeof variants]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold text-charcoal-900 dark:text-white">
        Order History
      </h2>

      <Card className="bg-cream-100 dark:bg-charcoal-800 border-cream-400 dark:border-charcoal-700">
        <CardHeader>
          <CardTitle className="text-charcoal-900 dark:text-white">
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cream-400 dark:border-charcoal-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal-700 dark:text-cream-300">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal-700 dark:text-cream-300">
                    Service
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal-700 dark:text-cream-300">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal-700 dark:text-cream-300">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal-700 dark:text-cream-300">
                    Payment
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal-700 dark:text-cream-300">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={order.id}
                    className={`border-b border-cream-300 dark:border-charcoal-700 hover:bg-cream-200 dark:hover:bg-charcoal-700 transition-colors ${
                      index % 2 === 0 ? 'bg-cream-50 dark:bg-charcoal-800' : 'bg-white dark:bg-charcoal-900'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-coral-600 dark:text-coral-400">
                        {order.id}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-charcoal-900 dark:text-white">
                        {order.serviceName}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-charcoal-700 dark:text-cream-300">
                        {formatDate(order.date)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-semibold text-charcoal-900 dark:text-white">
                        PKR {order.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-charcoal-700 dark:text-cream-300">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(order.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}