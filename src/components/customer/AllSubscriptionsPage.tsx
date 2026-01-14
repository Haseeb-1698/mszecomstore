import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { SubscriptionStatusBadge, getDaysRemaining } from '../ui/StatusBadge';
import { formatDate } from '../../lib/utils';

const AllSubscriptionsPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchSubscriptions();
  }, [filter]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      let query = supabase
        .from('subscriptions')
        .select(`
          *,
          plan:plans (
            *,
            service:services (*)
          )
        `)
        .eq('user_id', user.id)
        .order('expires_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;

      setSubscriptions(data || []);
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
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
                My Subscriptions
              </h1>
              <p className="text-charcoal-600 dark:text-cream-300">
                Manage and view all your subscriptions
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'all', label: 'All Subscriptions' },
              { value: 'active', label: 'Active' },
              { value: 'expired', label: 'Expired' },
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

        {/* Subscriptions Grid */}
        {(() => {
          if (loading) {
            return (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-cream-100 dark:bg-charcoal-800 rounded-2xl border border-cream-300 dark:border-charcoal-700 p-6 animate-pulse">
                    <div className="w-16 h-16 bg-cream-200 dark:bg-charcoal-700 rounded-lg mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-cream-200 dark:bg-charcoal-700 rounded w-3/4"></div>
                      <div className="h-3 bg-cream-200 dark:bg-charcoal-700 rounded w-1/2"></div>
                      <div className="h-2 bg-cream-200 dark:bg-charcoal-700 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            );
          }
          if (subscriptions.length === 0) {
            return (
              <div className="bg-cream-100 dark:bg-charcoal-800 rounded-2xl border border-cream-300 dark:border-charcoal-700 p-12 text-center">
                <div className="w-20 h-20 bg-cream-200 dark:bg-charcoal-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-charcoal-400 dark:text-cream-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-charcoal-900 dark:text-cream-50 mb-2">
                  No subscriptions found
                </h3>
                <p className="text-charcoal-600 dark:text-cream-300 mb-6">
                  {filter === 'all'
                    ? "You don't have any subscriptions yet"
                    : `No ${filter} subscriptions found`}
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {subscriptions.map((subscription) => {
                const daysRemaining = getDaysRemaining(subscription.expires_at);
                const service = subscription.plan?.service;
                const plan = subscription.plan;
                const totalDays = Math.floor(
                  (new Date(subscription.expires_at).getTime() -
                    new Date(subscription.started_at).getTime()) /
                    (1000 * 60 * 60 * 24)
                );
                // Prevent division by zero - default to 0% progress if totalDays is 0
                const progress = totalDays > 0 
                  ? Math.min(100, Math.max(0, (daysRemaining / totalDays) * 100))
                  : 0;

                return (
                <div
                  key={subscription.id}
                  className="bg-cream-100 dark:bg-charcoal-800 rounded-2xl border border-cream-300 dark:border-charcoal-700 overflow-hidden hover:shadow-soft-lg transition-shadow"
                >
                  {/* Header */}
                  <div className="p-6 border-b border-cream-300 dark:border-charcoal-700">
                    <div className="flex items-start gap-4">
                      {service?.logo && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white dark:bg-charcoal-750 p-2">
                          <img
                            src={service.logo}
                            alt={service.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-charcoal-900 dark:text-cream-50 mb-1 truncate">
                          {service?.name || 'Unknown Service'}
                        </h3>
                        <p className="text-sm text-charcoal-600 dark:text-cream-300">
                          {plan?.name || 'Unknown Plan'}
                        </p>
                      </div>
                      <SubscriptionStatusBadge status={subscription.status} daysRemaining={daysRemaining} />
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
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
                    {subscription.status === 'active' && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-charcoal-500 dark:text-cream-400">
                            {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Expired'}
                          </span>
                          {subscription.auto_renew && (
                            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Auto-renew
                            </span>
                          )}
                        </div>
                        <div className="w-full bg-cream-200 dark:bg-charcoal-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              daysRemaining <= 7 ? 'bg-orange-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Credentials */}
                    {subscription.credentials && (
                      <div className="mb-4 p-4 bg-cream-200 dark:bg-charcoal-750 rounded-lg">
                        <p className="text-xs text-charcoal-500 dark:text-cream-400 mb-2 font-semibold uppercase tracking-wide">
                          Account Credentials
                        </p>
                        <div className="space-y-2">
                          {Object.entries(subscription.credentials as Record<string, any>).map(
                            ([key, value]) => (
                              <div key={key}>
                                <p className="text-xs text-charcoal-600 dark:text-cream-300 mb-1 capitalize">
                                  {key}
                                </p>
                                <code className="block text-sm text-charcoal-900 dark:text-cream-50 font-mono bg-white dark:bg-charcoal-900 px-3 py-2 rounded break-all">
                                  {value as string}
                                </code>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      {subscription.status === 'active' && daysRemaining <= 7 && daysRemaining > 0 && (
                        <a
                          href="/services"
                          className="flex-1 text-center px-4 py-2 bg-coral-500 hover:bg-coral-600 dark:bg-coral-600 dark:hover:bg-coral-700 text-white rounded-lg font-medium transition-colors text-sm"
                        >
                          Renew Now
                        </a>
                      )}
                      {subscription.status === 'expired' && (
                        <a
                          href="/services"
                          className="flex-1 text-center px-4 py-2 bg-coral-500 hover:bg-coral-600 dark:bg-coral-600 dark:hover:bg-coral-700 text-white rounded-lg font-medium transition-colors text-sm"
                        >
                          Subscribe Again
                        </a>
                      )}
                      {subscription.order_id && (
                        <a
                          href={`/order/${subscription.order_id}`}
                          className="flex-1 text-center px-4 py-2 bg-cream-200 hover:bg-cream-300 dark:bg-charcoal-700 dark:hover:bg-charcoal-600 text-charcoal-900 dark:text-cream-50 rounded-lg font-medium transition-colors text-sm"
                        >
                          View Order
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          );
        })()}

        {/* Stats Summary */}
        {!loading && subscriptions.length > 0 && (
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="bg-cream-100 dark:bg-charcoal-800 rounded-xl border border-cream-300 dark:border-charcoal-700 p-4">
              <p className="text-sm text-charcoal-600 dark:text-cream-300 mb-1">Total</p>
              <p className="text-2xl font-bold text-charcoal-900 dark:text-cream-50">
                {subscriptions.length}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 rounded-xl border border-green-300 dark:border-green-700 p-4">
              <p className="text-sm text-green-700 dark:text-green-300 mb-1">Active</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-50">
                {subscriptions.filter((s) => s.status === 'active').length}
              </p>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900/30 rounded-xl border border-orange-300 dark:border-orange-700 p-4">
              <p className="text-sm text-orange-700 dark:text-orange-300 mb-1">Expiring Soon</p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-50">
                {
                  subscriptions.filter(
                    (s) =>
                      s.status === 'active' &&
                      getDaysRemaining(s.expires_at) <= 7 &&
                      getDaysRemaining(s.expires_at) >= 0
                  ).length
                }
              </p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 rounded-xl border border-red-300 dark:border-red-700 p-4">
              <p className="text-sm text-red-700 dark:text-red-300 mb-1">Expired</p>
              <p className="text-2xl font-bold text-red-900 dark:text-red-50">
                {subscriptions.filter((s) => s.status === 'expired').length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSubscriptionsPage;
