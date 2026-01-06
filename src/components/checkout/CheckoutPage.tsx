import React, { useState } from 'react';
import { useCartContext } from '../../contexts/CartContext';
import { Button } from '../ui/Button';
import CheckoutForm from './CheckoutForm';
import OrderReview from './OrderReview';
import PaymentSection from './PaymentSection';

interface CustomerInfo {
  name: string;
  email: string;
  whatsapp: string;
  instructions: string;
}

type PaymentMethod = 'EasyPaisa' | 'JazzCash' | 'Bank Transfer';

// Demo cart data for when cart is empty
const demoCart = {
  id: 'demo_cart',
  items: [
    {
      id: 'demo_1',
      serviceId: 'netflix',
      planId: 'netflix-standard',
      serviceName: 'Netflix Premium',
      planDuration: 'Standard Plan - 1 Month',
      price: 1500,
      quantity: 1
    },
    {
      id: 'demo_2',
      serviceId: 'spotify',
      planId: 'spotify-individual',
      serviceName: 'Spotify Premium',
      planDuration: 'Individual Plan - 1 Month',
      price: 800,
      quantity: 1
    }
  ],
  subtotal: 2300,
  discount: 0,
  total: 2300,
  createdAt: new Date(),
  updatedAt: new Date()
};

const CheckoutPage: React.FC = () => {
  const { cart, isLoading } = useCartContext();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    whatsapp: '',
    instructions: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('EasyPaisa');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Use demo cart if real cart is empty or loading
  const displayCart = (!isLoading && cart.items.length > 0) ? cart : demoCart;

  const validateCustomerInfo = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!customerInfo.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!customerInfo.whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCustomerInfo() || !agreeToTerms) {
      if (!agreeToTerms) {
        alert('Please agree to the terms and conditions');
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate order creation
      const sessionId = `checkout_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

      // Redirect to payment page
      globalThis.location.href = `/payment/success?session=${sessionId}&method=${encodeURIComponent(paymentMethod)}`;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to process checkout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-charcoal-900 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <a href="/cart">
              <Button variant="ghost" size="md">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Cart
              </Button>
            </a>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <svg className="w-8 h-8 text-coral-500 dark:text-coral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <h1 className="text-4xl font-bold text-charcoal-800 dark:text-cream-100">Checkout</h1>
          </div>

          <p className="text-charcoal-700 dark:text-cream-300 text-lg">
            Complete your order
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-coral-500 text-white flex items-center justify-center font-bold">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-charcoal-800 dark:text-cream-100">Cart</span>
            </div>
            <div className="flex-1 h-1 bg-coral-500 mx-2"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-coral-500 text-white flex items-center justify-center font-bold">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-charcoal-800 dark:text-cream-100">Checkout</span>
            </div>
            <div className="flex-1 h-1 bg-cream-400 dark:bg-charcoal-700 mx-2"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-cream-400 dark:bg-charcoal-700 text-charcoal-600 dark:text-cream-400 flex items-center justify-center font-bold">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-charcoal-600 dark:text-cream-400">Payment</span>
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        {displayCart === demoCart && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Demo Mode: Showing sample checkout with demo items
              </span>
            </div>
          </div>
        )}

        {/* Checkout Content */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-8">
              <CheckoutForm
                customerInfo={customerInfo}
                setCustomerInfo={setCustomerInfo}
                errors={errors}
                setErrors={setErrors}
              />

              <PaymentSection
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />

              {/* Terms and Conditions */}
              <div className="bg-cream-100 dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-700 rounded-2xl p-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-cream-400 dark:border-charcoal-600 text-coral-500 focus:ring-coral-500"
                  />
                  <span className="text-sm text-charcoal-700 dark:text-cream-300">
                    I agree to the{' '}
                    <a href="/terms" className="text-coral-500 hover:text-coral-600 underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-coral-500 hover:text-coral-600 underline">
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </div>
            </div>

            {/* Right Column - Order Review */}
            <div className="lg:col-span-1">
              <OrderReview
                cart={displayCart}
                isSubmitting={isSubmitting}
                agreeToTerms={agreeToTerms}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
