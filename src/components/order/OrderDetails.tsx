import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatPrice } from '../../lib/utils';
import { supabase } from '../../lib/supabase';

interface OrderItem {
  id: string;
  service_name: string;
  plan_name: string;
  duration_months: number;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_whatsapp: string;
  amount: number;
  special_instructions?: string;
  order_items: OrderItem[];
}

interface OrderDetailsProps {
  orderId?: string;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ orderId }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('No order ID provided');
        setLoading(false);
        return;
      }

      try {
        // Fetch order with order items
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (*)
          `)
          .eq('id', orderId)
          .single();

        if (orderError) throw orderError;

        setOrder(orderData as Order);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 dark:bg-charcoal-900 py-16">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center">
          <div className="text-charcoal-800 dark:text-cream-100">Loading order details...</div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-cream-50 dark:bg-charcoal-900 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-red-500/20 dark:bg-red-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-charcoal-800 dark:text-cream-100 mb-4">
              {error || 'Order not found'}
            </h1>
            <a href="/dashboard">
              <Button variant="primary">Go to Dashboard</Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    processing: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    completed: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    delivered: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
  };

  const subtotal = order.order_items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || order.amount;

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-charcoal-900 py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500/20 dark:bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-charcoal-800 dark:text-cream-100 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-lg text-charcoal-700 dark:text-cream-300">
            Thank you for your order. We&apos;ll send you updates on WhatsApp.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {/* Order Info */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-charcoal-600 dark:text-cream-400">Order Number</p>
                  <p className="font-semibold text-charcoal-800 dark:text-cream-100 font-mono text-sm">
                    {order.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-charcoal-600 dark:text-cream-400">Order Date</p>
                  <p className="font-semibold text-charcoal-800 dark:text-cream-100">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-charcoal-600 dark:text-cream-400">Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColors[order.status] || statusColors.pending}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-charcoal-600 dark:text-cream-400">Name</p>
                <p className="text-charcoal-800 dark:text-cream-100">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-sm text-charcoal-600 dark:text-cream-400">Email</p>
                <p className="text-charcoal-800 dark:text-cream-100">{order.customer_email}</p>
              </div>
              <div>
                <p className="text-sm text-charcoal-600 dark:text-cream-400">WhatsApp</p>
                <p className="text-charcoal-800 dark:text-cream-100">{order.customer_whatsapp}</p>
              </div>
              {order.special_instructions && (
                <div>
                  <p className="text-sm text-charcoal-600 dark:text-cream-400">Special Instructions</p>
                  <p className="text-charcoal-800 dark:text-cream-100">{order.special_instructions}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.order_items && order.order_items.length > 0 ? (
                  order.order_items.map((item) => (
                    <div key={item.id} className="flex justify-between py-3 border-b border-cream-400 dark:border-charcoal-700 last:border-0">
                      <div>
                        <p className="font-medium text-charcoal-800 dark:text-cream-100">{item.service_name}</p>
                        <p className="text-sm text-charcoal-600 dark:text-cream-400">
                          {item.plan_name} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-charcoal-800 dark:text-cream-100">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="py-3">
                    <p className="font-medium text-charcoal-800 dark:text-cream-100">Order Total</p>
                  </div>
                )}

                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-charcoal-700 dark:text-cream-300">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-charcoal-800 dark:text-cream-100 pt-2 border-t border-cream-400 dark:border-charcoal-700">
                    <span>Total</span>
                    <span>{formatPrice(order.amount)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card variant="elevated" className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="space-y-3">
              <h3 className="font-semibold text-charcoal-800 dark:text-cream-100">What&apos;s Next?</h3>
              <ul className="space-y-2 text-sm text-charcoal-700 dark:text-cream-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 dark:text-purple-400 mt-0.5">1.</span>
                  <span>We will contact you via WhatsApp with payment instructions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 dark:text-purple-400 mt-0.5">2.</span>
                  <span>Once payment is confirmed, we&apos;ll activate your subscription</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 dark:text-purple-400 mt-0.5">3.</span>
                  <span>You&apos;ll receive your login credentials within 5-10 minutes</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/dashboard" className="flex-1">
              <Button variant="outline" size="lg" fullWidth>
                View Dashboard
              </Button>
            </a>
            <a href="/services" className="flex-1">
              <Button variant="primary" size="lg" fullWidth>
                Browse More Services
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
