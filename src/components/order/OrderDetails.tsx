import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatPrice } from '../../lib/utils';

interface OrderDetailsProps {
  orderId?: string;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ orderId = 'ORD-12345' }) => {
  // Mock order data
  const order = {
    id: orderId,
    date: new Date().toLocaleDateString(),
    status: 'confirmed',
    customerName: 'John Doe',
    email: 'john@example.com',
    whatsapp: '+92 300 1234567',
    items: [
      { name: 'Netflix', plan: 'Premium - 12 months', price: 119.88, quantity: 1 },
      { name: 'Spotify', plan: 'Individual - 12 months', price: 99.99, quantity: 1 }
    ],
    subtotal: 219.87,
    discount: 20,
    total: 199.87
  };

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-charcoal-900 py-16">
      <div className="container mx-auto px-4">
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
                  <p className="font-semibold text-charcoal-800 dark:text-cream-100">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-charcoal-600 dark:text-cream-400">Order Date</p>
                  <p className="font-semibold text-charcoal-800 dark:text-cream-100">{order.date}</p>
                </div>
                <div>
                  <p className="text-sm text-charcoal-600 dark:text-cream-400">Status</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
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
                <p className="text-charcoal-800 dark:text-cream-100">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-charcoal-600 dark:text-cream-400">Email</p>
                <p className="text-charcoal-800 dark:text-cream-100">{order.email}</p>
              </div>
              <div>
                <p className="text-sm text-charcoal-600 dark:text-cream-400">WhatsApp</p>
                <p className="text-charcoal-800 dark:text-cream-100">{order.whatsapp}</p>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={`${item.name}-${item.plan}-${item.price}`} className="flex justify-between py-3 border-b border-cream-400 dark:border-charcoal-700 last:border-0">
                    <div>
                      <p className="font-medium text-charcoal-800 dark:text-cream-100">{item.name}</p>
                      <p className="text-sm text-charcoal-600 dark:text-cream-400">{item.plan}</p>
                    </div>
                    <p className="font-semibold text-charcoal-800 dark:text-cream-100">{formatPrice(item.price)}</p>
                  </div>
                ))}

                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-charcoal-700 dark:text-cream-300">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-coral-600 dark:text-coral-400">
                      <span>Discount</span>
                      <span>-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold text-charcoal-800 dark:text-cream-100 pt-2 border-t border-cream-400 dark:border-charcoal-700">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
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
                  <span>We will contact you via WhatsApp with further instructions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 dark:text-purple-400 mt-0.5">2.</span>
                  <span>Once confirmed, we&apos;ll activate your subscription</span>
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
            <a href="/" className="flex-1">
              <Button variant="outline" size="lg" fullWidth>
                Back to Home
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
