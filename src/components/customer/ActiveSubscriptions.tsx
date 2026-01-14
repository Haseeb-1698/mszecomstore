import React from 'react';
import type { DbSubscription } from '../../lib/database.types';

interface ActiveSubscriptionsProps {
  subscriptions: any[];
  onRefresh: () => void;
}

const ActiveSubscriptions: React.FC<ActiveSubscriptionsProps> = ({ subscriptions, onRefresh }) => {
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');

  const getDaysRemaining = (expiresAt: string) => {
    const days = Math.floor((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getStatusBadge = (daysRemaining: number) => {
    if (daysRemaining < 0) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg">Expired</span>;
    }
    if (daysRemaining <= 7) {
      return <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-lg">Expiring Soon</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg">Active</span>;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-cream-100 dark:bg-charcoal-800 rounded-2xl border border-cream-300 dark:border-charcoal-700 overflow-hidden">
      <div className="p-6 border-b border-cream-300 dark:border-charcoal-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-charcoal-900 dark:text-cream-50 mb-1">
              Active Subscriptions
            </h2>
            <p className="text-sm text-charcoal-600 dark:text-cream-300">
              {activeSubscriptions.length} active subscription{activeSubscriptions.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="p-2 hover:bg-cream-200 dark:hover:bg-charcoal-700 rounded-lg transition-colors"
            aria-label="Refresh subscriptions"
          >
            <svg className="w-5 h-5 text-charcoal-600 dark:text-cream-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeSubscriptions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-cream-200 dark:bg-charcoal-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-charcoal-400 dark:text-cream-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-charcoal-900 dark:text-cream-50 mb-2">
              No active subscriptions
            </h3>
            <p className="text-charcoal-600 dark:text-cream-300 mb-4">
              Start by browsing our services and subscribe to get started
            </p>
            <a
              href="/services"
              className="inline-block px-6 py-2 bg-coral-500 hover:bg-coral-600 dark:bg-coral-600 dark:hover:bg-coral-700 text-white rounded-lg font-medium transition-colors"
            >
              Browse Services
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {activeSubscriptions.map((subscription) => {
              const daysRemaining = getDaysRemaining(subscription.expires_at);
              const service = subscription.plan?.service;
              const plan = subscription.plan;

              return (
                <div
                  key={subscription.id}
                  className="bg-cream-50 dark:bg-charcoal-750 rounded-xl p-4 border border-cream-300 dark:border-charcoal-700 hover:shadow-soft transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* Service Logo */}
                    {service?.logo && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white dark:bg-charcoal-800 p-2">
                        <img
                          src={service.logo}
                          alt={service.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}

                    {/* Subscription Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-charcoal-900 dark:text-cream-50 mb-1">
                            {service?.name || 'Unknown Service'}
                          </h3>
                          <p className="text-sm text-charcoal-600 dark:text-cream-300">
                            {plan?.name || 'Unknown Plan'}
                          </p>
                        </div>
                        {getStatusBadge(daysRemaining)}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <p className="text-xs text-charcoal-500 dark:text-cream-400 mb-1">Started</p>
                          <p className="text-sm font-medium text-charcoal-900 dark:text-cream-50">
                            {formatDate(subscription.started_at)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-charcoal-500 dark:text-cream-400 mb-1">Expires</p>
                          <p className="text-sm font-medium text-charcoal-900 dark:text-cream-50">
                            {formatDate(subscription.expires_at)}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-charcoal-500 dark:text-cream-400">
                            {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Expired'}
                          </span>
                          {subscription.auto_renew && (
                            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                              Auto-renew enabled
                            </span>
                          )}
                        </div>
                        <div className="w-full bg-cream-200 dark:bg-charcoal-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              daysRemaining <= 7
                                ? 'bg-orange-500'
                                : 'bg-green-500'
                            }`}
                            style={{
                              width: `${Math.min(
                                100,
                                Math.max(
                                  0,
                                  (daysRemaining /
                                    Math.floor(
                                      (new Date(subscription.expires_at).getTime() -
                                        new Date(subscription.started_at).getTime()) /
                                        (1000 * 60 * 60 * 24)
                                    )) *
                                    100
                                )
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Credentials (if available) */}
                      {subscription.credentials && (
                        <div className="mt-3 p-3 bg-cream-200 dark:bg-charcoal-800 rounded-lg">
                          <p className="text-xs text-charcoal-500 dark:text-cream-400 mb-2 font-medium">
                            Account Credentials
                          </p>
                          <div className="space-y-1 text-sm">
                            {Object.entries(subscription.credentials as Record<string, any>).map(([key, value]) => (
                              <div key={key} className="flex items-center gap-2">
                                <span className="text-charcoal-600 dark:text-cream-300 capitalize">{key}:</span>
                                <code className="text-charcoal-900 dark:text-cream-50 font-mono text-xs bg-white dark:bg-charcoal-900 px-2 py-1 rounded">
                                  {value as string}
                                </code>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveSubscriptions;
