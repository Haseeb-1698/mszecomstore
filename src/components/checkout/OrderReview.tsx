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
    <Card variant="elevated" className="sticky top-4">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-3">
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <div className="flex-1">
                <p className="font-medium text-charcoal-800 dark:text-cream-100">
                  {item.serviceName}
                </p>
                <p className="text-charcoal-600 dark:text-cream-400 text-xs">
                  {item.planDuration} × {item.quantity}
                </p>
              </div>
              <p className="font-medium text-charcoal-800 dark:text-cream-100">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-cream-400 dark:border-charcoal-700 pt-4 space-y-2">
          <div className="flex justify-between text-charcoal-700 dark:text-cream-300">
            <span>Subtotal</span>
            <span className="font-medium">${cart.subtotal.toFixed(2)}</span>
          </div>

          {cart.discount > 0 && (
            <div className="flex justify-between text-coral-600 dark:text-coral-400">
              <span>Discount</span>
              <span className="font-medium">-${cart.discount.toFixed(2)}</span>
            </div>
          )}

          <div className="border-t border-cream-400 dark:border-charcoal-700 pt-2">
            <div className="flex justify-between text-xl font-bold text-charcoal-800 dark:text-cream-100">
              <span>Total</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={isSubmitting || !agreeToTerms}
        >
          {isSubmitting ? 'Processing...' : 'Place Order'}
        </Button>

        <div className="text-xs text-center text-charcoal-600 dark:text-cream-400 space-y-1">
          <p>🔒 Secure checkout powered by SSL</p>
          <p>⚡ Instant delivery after confirmation</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderReview;
