import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface PaymentData {
  cardNumber: string;
  expiry: string;
  cvc: string;
  name: string;
}

interface StripePaymentProps {
  onSubmit: (paymentData: PaymentData) => void;
  isLoading?: boolean;
}

const StripePayment: React.FC<StripePaymentProps> = ({ onSubmit, isLoading = false }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      cardNumber,
      expiry,
      cvc,
      name
    });
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replaceAll(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19); // 16 digits + 3 spaces
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replaceAll(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Card Details (Mock)</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl mb-4">
            <p className="text-sm text-purple-800 dark:text-purple-300">
              <strong>⚠️ This is a placeholder UI.</strong> Actual Stripe integration will be implemented later.
              For now, this form is for display purposes only.
            </p>
          </div>

          <Input
            label="Cardholder Name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            disabled
          />

          <Input
            label="Card Number"
            type="text"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            fullWidth
            disabled
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Expiry Date"
              type="text"
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              disabled
            />

            <Input
              label="CVC"
              type="text"
              placeholder="123"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replaceAll(/\D/g, '').substring(0, 4))}
              disabled
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={true}
          >
            {isLoading ? 'Processing...' : 'Pay Now (Disabled)'}
          </Button>

          <div className="flex items-center justify-center gap-2 mt-4">
            <svg className="w-8 h-8 text-charcoal-400 dark:text-cream-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v3h16V6H4zm0 5v7h16v-7H4z"/>
            </svg>
            <span className="text-xs text-charcoal-600 dark:text-cream-400">
              Secured by Stripe (Coming Soon)
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StripePayment;
