import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { DbSubscriptionInsert } from '../../lib/database.types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  onSuccess: () => void;
}

interface OrderDetails {
  id: string;
  user_id: string;
  plan_id: string;
  customer_name: string;
  customer_email: string;
  order_items: {
    service_name: string;
    plan_name: string;
    duration_months: number;
  }[];
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  orderId,
  onSuccess,
}) => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Credential fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [notes, setNotes] = useState('');
  const [autoRenew, setAutoRenew] = useState(false);
  
  // Date fields
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [durationMonths, setDurationMonths] = useState(1);

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetails();
    }
  }, [isOpen, orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select(`
          id,
          user_id,
          plan_id,
          customer_name,
          customer_email,
          order_items (
            service_name,
            plan_name,
            duration_months
          )
        `)
        .eq('id', orderId)
        .single();

      if (fetchError) throw fetchError;
      
      setOrderDetails(data as OrderDetails);
      
      // Pre-fill duration from order
      if (data.order_items?.[0]?.duration_months) {
        setDurationMonths(data.order_items[0].duration_months);
      }
      
      // Generate default email
      const serviceName = data.order_items?.[0]?.service_name?.toLowerCase().replace(/\s+/g, '') || 'service';
      const emailPrefix = data.customer_email ? data.customer_email.split('@')[0] : 'user';
      setEmail(`${emailPrefix}.${serviceName}@temp.com`);

    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const calculateExpiryDate = (start: string, months: number): string => {
    const startDate = new Date(start);
    const expiryDate = new Date(startDate);
    expiryDate.setMonth(expiryDate.getMonth() + months);
    return expiryDate.toISOString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderDetails) {
      setError('Order details not loaded');
      return;
    }
    
    if (!email && !username) {
      setError('Please provide either email or username');
      return;
    }
    
    if (!password) {
      setError('Please provide a password');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Build credentials object
      const credentials: Record<string, string> = {};
      if (email) credentials.email = email;
      if (username) credentials.username = username;
      credentials.password = password;

      // Calculate dates
      const started_at = new Date(startDate).toISOString();
      const expires_at = calculateExpiryDate(startDate, durationMonths);

      // Create subscription
      const subscriptionData: DbSubscriptionInsert = {
        user_id: orderDetails.user_id,
        plan_id: orderDetails.plan_id,
        order_id: orderId,
        credentials: credentials,
        status: 'active',
        auto_renew: autoRenew,
        notes: notes || null,
        started_at,
        expires_at,
      };

      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert(subscriptionData);

      if (insertError) throw insertError;

      // Success!
      onSuccess();
      handleClose();
      
    } catch (err) {
      console.error('Error creating subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to create subscription');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setNotes('');
    setAutoRenew(false);
    setStartDate(new Date().toISOString().split('T')[0]);
    setDurationMonths(1);
    setOrderDetails(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-cream-50 dark:bg-charcoal-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-cream-50 dark:bg-charcoal-800 border-b border-cream-400 dark:border-charcoal-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-charcoal-800 dark:text-cream-100">
            Create Subscription
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-cream-200 dark:hover:bg-charcoal-700 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-charcoal-600 dark:text-cream-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-500 mx-auto"></div>
              <p className="mt-4 text-charcoal-600 dark:text-cream-400">Loading order details...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : orderDetails ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Order Info */}
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                <h3 className="font-semibold text-charcoal-800 dark:text-cream-100 mb-2">Order Information</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-charcoal-700 dark:text-cream-300">
                    <span className="font-medium">Customer:</span> {orderDetails.customer_name}
                  </p>
                  <p className="text-charcoal-700 dark:text-cream-300">
                    <span className="font-medium">Email:</span> {orderDetails.customer_email}
                  </p>
                  <p className="text-charcoal-700 dark:text-cream-300">
                    <span className="font-medium">Service:</span> {orderDetails.order_items?.[0]?.service_name}
                  </p>
                  <p className="text-charcoal-700 dark:text-cream-300">
                    <span className="font-medium">Plan:</span> {orderDetails.order_items?.[0]?.plan_name}
                  </p>
                </div>
              </div>

              {/* Credentials Section */}
              <div>
                <h3 className="font-semibold text-charcoal-800 dark:text-cream-100 mb-3">Service Credentials</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 dark:text-cream-300 mb-1">
                      Email/Account ID
                    </label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@service.com"
                      className="w-full px-4 py-2 bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-700 rounded-lg text-charcoal-800 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-coral-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 dark:text-cream-300 mb-1">
                      Username (optional)
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="username"
                      className="w-full px-4 py-2 bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-700 rounded-lg text-charcoal-800 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-coral-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 dark:text-cream-300 mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                      className="w-full px-4 py-2 bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-700 rounded-lg text-charcoal-800 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-coral-500"
                    />
                  </div>
                </div>
              </div>

              {/* Subscription Duration */}
              <div>
                <h3 className="font-semibold text-charcoal-800 dark:text-cream-100 mb-3">Subscription Period</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 dark:text-cream-300 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-2 bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-700 rounded-lg text-charcoal-800 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-coral-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 dark:text-cream-300 mb-1">
                      Duration (months)
                    </label>
                    <input
                      type="number"
                      value={durationMonths}
                      onChange={(e) => setDurationMonths(Number(e.target.value))}
                      min="1"
                      max="36"
                      className="w-full px-4 py-2 bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-700 rounded-lg text-charcoal-800 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-coral-500"
                    />
                  </div>
                </div>
                <p className="text-xs text-charcoal-600 dark:text-cream-400 mt-2">
                  Expiry: {new Date(calculateExpiryDate(startDate, durationMonths)).toLocaleDateString()}
                </p>
              </div>

              {/* Additional Options */}
              <div>
                <h3 className="font-semibold text-charcoal-800 dark:text-cream-100 mb-3">Additional Options</h3>
                
                <div className="mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoRenew}
                      onChange={(e) => setAutoRenew(e.target.checked)}
                      className="w-4 h-4 text-coral-500 bg-cream-100 dark:bg-charcoal-900 border-cream-400 dark:border-charcoal-700 rounded focus:ring-coral-500"
                    />
                    <span className="text-sm text-charcoal-700 dark:text-cream-300">
                      Enable auto-renewal
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal-700 dark:text-cream-300 mb-1">
                    Admin Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Internal notes about this subscription..."
                    rows={3}
                    className="w-full px-4 py-2 bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-700 rounded-lg text-charcoal-800 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-coral-500 resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-cream-400 dark:border-charcoal-700">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-cream-200 dark:bg-charcoal-700 text-charcoal-700 dark:text-cream-300 rounded-lg font-medium hover:bg-cream-300 dark:hover:bg-charcoal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-coral-500 hover:bg-coral-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    'Create Subscription'
                  )}
                </button>
              </div>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
