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
        <div className="w-16 h-10 rounded-lg overflow-hidden bg-transparent flex items-center justify-center">
          <img src="/icons/easy.png" alt="EasyPaisa" className="w-full h-full object-contain" />
        </div>
      ),
      description: 'Pay instantly with your EasyPaisa mobile wallet',
      processingTime: 'Instant',
      popular: true
    },
    {
      id: 'JazzCash' as PaymentMethod,
      name: 'JazzCash',
      icon: (
        <div className="w-16 h-10 rounded-lg overflow-hidden bg-transparent flex items-center justify-center">
          <img src="/icons/jazz.png" alt="JazzCash" className="w-full h-full object-contain" />
        </div>
      ),
      description: 'Pay securely with your JazzCash mobile account',
      processingTime: 'Instant',
      popular: false
    },
    {
      id: 'Bank Transfer' as PaymentMethod,
      name: 'Bank Transfer',
      icon: (
        <div className="w-16 h-10 rounded-lg overflow-hidden bg-transparent flex items-center justify-center">
          <img src="/icons/bank-alfalah-logo.png" alt="Bank Alfalah" className="w-full h-full object-contain" />
        </div>
      ),
      description: 'Transfer directly from your bank account',
      processingTime: '1-2 hours',
      popular: false
    }
  ];

  return (
    <Card variant="elevated" className="bg-cream-100 dark:bg-charcoal-800 border-cream-400 dark:border-charcoal-700">
      <CardHeader>
        <CardTitle className="text-charcoal-900 dark:text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-coral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Payment Method
        </CardTitle>
        <p className="text-sm text-charcoal-600 dark:text-cream-400">
          Choose your preferred payment method
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            htmlFor={`payment-${method.id.replaceAll(/\s+/g, '-')}`}
            className={`relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              paymentMethod === method.id
                ? 'border-coral-500 dark:border-coral-400 bg-coral-50 dark:bg-coral-900/20 shadow-md'
                : 'border-cream-300 dark:border-charcoal-500 hover:border-coral-400 dark:hover:border-coral-500 bg-cream-50 dark:bg-charcoal-700'
            }`}
          >
            {method.popular && (
              <div className="absolute -top-2 -right-2 bg-coral-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Popular
              </div>
            )}
            
            <input
              id={`payment-${method.id.replaceAll(/\s+/g, '-')}`}
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={paymentMethod === method.id}
              onChange={() => setPaymentMethod(method.id)}
              className="mt-1 w-5 h-5 text-coral-500 focus:ring-coral-500 border-cream-400 dark:border-charcoal-600"
              aria-label={method.name}
            />
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {method.icon}
                <div>
                  <span className="font-semibold text-charcoal-800 dark:text-cream-100 text-lg">
                    {method.name}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                      {method.processingTime}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-charcoal-600 dark:text-cream-400">
                {method.description}
              </p>
            </div>
          </label>
        ))}

        {/* Payment Instructions */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                Payment Process
              </h4>
              <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                <li>1. Complete your order and receive payment instructions</li>
                <li>2. Make payment using your selected method</li>
                <li>3. Send payment screenshot to our WhatsApp</li>
                <li>4. Receive account details within 5-10 minutes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-center gap-2 text-xs text-charcoal-600 dark:text-cream-400 bg-cream-50 dark:bg-charcoal-700 p-3 rounded-lg">
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>All payments are secured and processed safely</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSection;
