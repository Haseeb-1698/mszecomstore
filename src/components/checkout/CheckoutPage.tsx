import React, { useState } from 'react';
import { useCartContext } from '../../contexts/CartContext';
import { Button } from '../ui/Button';
import CheckoutForm from './CheckoutForm';
import OrderReview from './OrderReview';
import { supabase } from '../../lib/supabase';
import type { DbOrderInsert, DbOrderItemInsert } from '../../lib/database.types';

interface CustomerInfo {
  name: string;
  email: string;
  whatsapp: string;
  instructions: string;
}

const CheckoutPage: React.FC = () => {
  const { cart, isLoading, clearCart, isAuthenticated } = useCartContext();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    whatsapp: '',
    instructions: ''
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  const items = cart?.items ?? [];

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
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert('Please log in to place an order');
        globalThis.location.href = '/login?redirect=/checkout';
        return;
      }
      
      const firstItem = items[0];
      if (!firstItem) {
        alert('Cart is empty');
        return;
      }

      // Create order in database
      const orderInsert: DbOrderInsert = {
        user_id: user.id,
        plan_id: firstItem.planId,
        amount: cart?.total ?? 0,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_whatsapp: customerInfo.whatsapp,
        special_instructions: customerInfo.instructions || null,
        status: 'pending'
      };
      
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderInsert)
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        throw new Error('Failed to create order');
      }
      
      if (!order) {
        throw new Error('No order returned after creation');
      }

      // Create order items
      const orderItems: DbOrderItemInsert[] = items.map(item => ({
        order_id: order.id,
        plan_id: item.planId,
        service_name: item.serviceName,
        plan_name: item.planName,
        duration_months: 1, // Default duration
        price: item.price,
        quantity: item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Order items error:', itemsError);
      }

      // Clear the cart after successful order
      await clearCart();

      // Redirect to order details page
      globalThis.location.href = `/order/${order.id}`;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to process checkout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-50 dark:bg-charcoal-900 flex items-center justify-center">
        <div className="text-charcoal-800 dark:text-cream-100">Loading checkout...</div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cream-50 dark:bg-charcoal-900 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-charcoal-800 dark:text-cream-100 mb-4">
              Please sign in to continue
            </h1>
            <p className="text-charcoal-700 dark:text-cream-300 mb-8">
              You need to be logged in to complete checkout.
            </p>
            <a href="/login?redirect=/checkout">
              <Button variant="primary" size="lg">
                Sign In
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 dark:bg-charcoal-900 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-charcoal-800 dark:text-cream-100 mb-4">
              Your cart is empty
            </h1>
            <p className="text-charcoal-700 dark:text-cream-300 mb-8">
              Add some services to your cart before checkout.
            </p>
            <a href="/services">
              <Button variant="primary" size="lg">
                Browse Services
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-charcoal-900 py-16">
      <div className="max-w-7xl mx-auto px-6">
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
                cart={cart}
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
