import React, { useState } from 'react';
import type { Cart } from '../../lib/types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface CartSummaryProps {
  cart: Cart;
  onApplyDiscount: (code: string) => boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({ cart, onApplyDiscount }) => {
  const [discountCode, setDiscountCode] = useState('');
  const [discountMessage, setDiscountMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      setDiscountMessage({ type: 'error', text: 'Please enter a discount code' });
      return;
    }

    const applied = onApplyDiscount(discountCode);
    if (applied) {
      setDiscountMessage({ type: 'success', text: 'Discount code applied!' });
      setDiscountCode('');
    } else {
      setDiscountMessage({ type: 'error', text: 'Invalid discount code' });
    }

    setTimeout(() => setDiscountMessage(null), 3000);
  };

  return (
    <Card variant="elevated" className="sticky top-4">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Subtotal */}
        <div className="flex justify-between text-charcoal-700 dark:text-cream-300">
          <span>Subtotal</span>
          <span className="font-medium">${cart.subtotal.toFixed(2)}</span>
        </div>

        {/* Discount */}
        {cart.discount > 0 && (
          <div className="flex justify-between text-coral-600 dark:text-coral-400">
            <span>Discount</span>
            <span className="font-medium">-${cart.discount.toFixed(2)}</span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-cream-400 dark:border-charcoal-700 pt-4">
          <div className="flex justify-between text-xl font-bold text-charcoal-800 dark:text-cream-100">
            <span>Total</span>
            <span>${cart.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Discount Code */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Discount code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyDiscount()}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="md"
              onClick={handleApplyDiscount}
            >
              Apply
            </Button>
          </div>

          {discountMessage && (
            <p className={`text-sm ${
              discountMessage.type === 'success'
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              {discountMessage.text}
            </p>
          )}
        </div>

        {/* Checkout Button */}
        <a href="/checkout" className="block">
          <Button variant="primary" size="lg" fullWidth>
            Proceed to Checkout
          </Button>
        </a>

        {/* Additional Info */}
        <div className="text-xs text-charcoal-600 dark:text-cream-400 text-center space-y-1">
          <p>Secure checkout powered by SSL encryption</p>
          <p>Instant delivery after payment confirmation</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartSummary;
