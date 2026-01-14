import React from 'react';

interface CustomerStatsCardProps {
  title: string;
  value: string;
  icon: 'subscriptions' | 'orders' | 'spending' | 'actions';
  trend: 'up' | 'down' | 'neutral';
  subtitle: string;
  isActionCard?: boolean;
}

const CustomerStatsCard: React.FC<CustomerStatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  subtitle,
  isActionCard = false
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'subscriptions':
        return (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
      case 'orders':
        return (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        );
      case 'spending':
        return (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'actions':
        return (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  if (isActionCard) {
    return (
      <div className="bg-gradient-to-br from-coral-500 to-coral-600 dark:from-coral-600 dark:to-coral-700 rounded-2xl p-6 border border-coral-400 dark:border-coral-700 shadow-soft hover:shadow-soft-lg transition-all">
        <div className="flex flex-col h-full justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 dark:bg-white/10 rounded-xl text-white">
              {getIcon()}
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          <div className="space-y-2">
            <a 
              href="/services" 
              className="block w-full text-center px-4 py-2 bg-white/20 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
            >
              Browse Services
            </a>
            <a 
              href="/cart" 
              className="block w-full text-center px-4 py-2 bg-white/20 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
            >
              View Cart
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream-100 dark:bg-charcoal-800 rounded-2xl p-6 border border-cream-300 dark:border-charcoal-700 hover:shadow-soft-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
          {getIcon()}
        </div>
        {trend !== 'neutral' && (
          <span
            className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg ${
              trend === 'up'
                ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
                : 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
            }`}
          >
            {trend === 'up' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-sm font-medium text-charcoal-600 dark:text-cream-300 mb-1">{title}</h3>
        <p className="text-2xl font-bold text-charcoal-900 dark:text-cream-50 mb-1">{value}</p>
        {subtitle && (
          <p className="text-sm text-charcoal-500 dark:text-cream-400">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default CustomerStatsCard;
