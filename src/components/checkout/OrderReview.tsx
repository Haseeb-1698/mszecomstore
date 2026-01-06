import React from 'react';
import type { Cart } from '../../lib/types';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface OrderReviewProps {
  cart: Cart;
  isSubmitting: boolean;
  agreeToTerms: boolean;
}
const OrderReview: React.FC<OrderReviewProps> = ({ cart, isSubmitting, agreeToTerms }) => {
  return (
    <div className="sticky top-4">
      <Card variant="elevated" className="h-fit max-h-[calc(100vh-2rem)] overflow-y-auto bg-cream-100 dark:bg-charcoal-800 border-cream-400 dark:border-charcoal-700 flex flex-col">
      <CardHeader>
        <CardTitle className="text-charcoal-900 dark:text-white">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Items */}
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-3 bg-cream-50 dark:bg-charcoal-700 rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold text-charcoal-800 dark:text-cream-100">
                    {item.serviceName}
                  </p>
                  <p className="text-charcoal-600 dark:text-cream-400 text-sm">
                    {item.planDuration}
                  </p>
                  <p className="text-charcoal-600 dark:text-cream-400 text-xs">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-charcoal-800 dark:text-cream-100">
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </p>
                  <p className="text-charcoal-600 dark:text-cream-400 text-xs">
                    PKR {item.price.toLocaleString()} each
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="border-t border-cream-400 dark:border-charcoal-700 pt-4 space-y-3">
            <div className="flex justify-between text-charcoal-700 dark:text-cream-300">
              <span>Subtotal ({cart.items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
              <span className="font-medium">PKR {cart.subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-charcoal-700 dark:text-cream-300">
              <span>Processing Fee</span>
              <span className="font-medium">PKR 0</span>
            </div>

            {cart.discount > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Discount Applied</span>
                <span className="font-medium">-PKR {cart.discount.toLocaleString()}</span>
              </div>
            )}

            <div className="border-t border-cream-400 dark:border-charcoal-700 pt-3">
              <div className="flex justify-between text-xl font-bold text-charcoal-800 dark:text-cream-100">
                <span>Total Amount</span>
                <span>PKR {cart.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Delivery Information</span>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-400">
              Account details will be delivered to your WhatsApp within 5-10 minutes after payment confirmation.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Place Order Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isSubmitting || !agreeToTerms}
            className="bg-coral-500 hover:bg-coral-600 text-white font-semibold py-4"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Order...
              </div>
            ) : (
              `Place Order - PKR ${cart.total.toLocaleString()}`
            )}
          </Button>

          {/* Security & Trust Indicators */}
          <div className="text-xs text-center text-charcoal-600 dark:text-cream-400 space-y-2">
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Instant Delivery</span>
              </div>
            </div>
            <p>Your payment is protected by our secure checkout system</p>
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
  );
};

export default OrderReview;
