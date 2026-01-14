import React from 'react';

// Order status types
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'delivered' | 'completed' | 'cancelled';

// SVG icons for order statuses
const STATUS_ICONS: Record<string, React.ReactNode> = {
  completed: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />,
  delivered: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  processing: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />,
  pending: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
  confirmed: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  cancelled: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />,
};

// Order status configuration
const ORDER_STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
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
  completed: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-400',
    label: 'Completed',
  },
  cancelled: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
    label: 'Cancelled',
  },
};

interface OrderStatusBadgeProps {
  status: string;
  showIcon?: boolean;
  className?: string;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, showIcon = false, className = '' }) => {
  const config = ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG.pending;
  const icon = STATUS_ICONS[status] || STATUS_ICONS.pending;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium ${config.bg} ${config.text} rounded-full ${className}`}>
      {showIcon && (
        <svg 
          className={`w-4 h-4 ${status === 'processing' ? 'animate-spin' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {icon}
        </svg>
      )}
      {config.label}
    </span>
  );
};

// Subscription status badge based on days remaining
interface SubscriptionStatusBadgeProps {
  status: string;
  daysRemaining?: number;
  className?: string;
}

export const SubscriptionStatusBadge: React.FC<SubscriptionStatusBadgeProps> = ({ 
  status, 
  daysRemaining, 
  className = '' 
}) => {
  // Determine the badge type based on status and days remaining
  if (status === 'expired' || (daysRemaining !== undefined && daysRemaining < 0)) {
    return (
      <span className={`px-3 py-1 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full ${className}`}>
        Expired
      </span>
    );
  }
  if (status === 'cancelled') {
    return (
      <span className={`px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 rounded-full ${className}`}>
        Cancelled
      </span>
    );
  }
  if (daysRemaining !== undefined && daysRemaining <= 7) {
    return (
      <span className={`px-3 py-1 text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-full ${className}`}>
        Expiring Soon
      </span>
    );
  }
  return (
    <span className={`px-3 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full ${className}`}>
      Active
    </span>
  );
};

// Utility function to calculate days remaining
export function getDaysRemaining(expiresAt: string): number {
  return Math.floor((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export default OrderStatusBadge;
