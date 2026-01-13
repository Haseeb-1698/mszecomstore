import React from 'react';
import type { OrderStatus } from '../../lib/database.types';

const STATUS_CONFIG: Record<OrderStatus, { styles: string; label: string; icon: React.ReactNode }> = {
  completed: {
    styles: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700',
    label: 'Completed',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  },
  delivered: {
    styles: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700',
    label: 'Delivered',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  },
  processing: {
    styles: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-700',
    label: 'Processing',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  },
  pending: {
    styles: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700',
    label: 'Pending',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  },
  cancelled: {
    styles: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700',
    label: 'Cancelled',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  }
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
  showIcon?: boolean;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, showIcon = false }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.styles}`}>
      {showIcon && (
        <svg className={`w-4 h-4 ${status === 'processing' ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {config.icon}
        </svg>
      )}
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
