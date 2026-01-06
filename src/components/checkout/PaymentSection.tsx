import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

type PaymentMethod = 'EasyPaisa' | 'JazzCash' | 'Bank Transfer';

interface PaymentSectionProps {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ paymentMethod, setPaymentMethod }) => {
  const paymentMethods = [
    {
      id: 'EasyPaisa' as PaymentMethod,
      name: 'EasyPaisa',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      description: 'Pay with your EasyPaisa account'
    },
    {
      id: 'JazzCash' as PaymentMethod,
      name: 'JazzCash',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      description: 'Pay with your JazzCash account'
    },
    {
      id: 'Bank Transfer' as PaymentMethod,
      name: 'Bank Transfer',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      ),
      description: 'Direct bank transfer'
    }
  ];

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            htmlFor={`payment-${method.id.replaceAll(/\s+/g, '-')}`}
            className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              paymentMethod === method.id
                ? 'border-coral-500 bg-coral-50 dark:bg-coral-900/20'
                : 'border-cream-400 dark:border-charcoal-700 hover:border-coral-400 dark:hover:border-coral-500'
            }`}
          >
            <input
              id={`payment-${method.id.replaceAll(/\s+/g, '-')}`}
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={paymentMethod === method.id}
              onChange={() => setPaymentMethod(method.id)}
              className="mt-1 w-5 h-5 text-coral-500 focus:ring-coral-500"
              aria-label={method.name}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-coral-500 dark:text-coral-400">{method.icon}</span>
                <span className="font-semibold text-charcoal-800 dark:text-cream-100">
                  {method.name}
                </span>
              </div>
              <p className="text-sm text-charcoal-600 dark:text-cream-400">
                {method.description}
              </p>
            </div>
          </label>
        ))}

        <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
          <p className="text-sm text-purple-800 dark:text-purple-300">
            <strong>Note:</strong> You will receive payment instructions after placing your order.
            Please complete the payment within 24 hours to activate your subscription.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSection;
