import React from 'react';
import { useCartContext } from '../../contexts/CartContext';
import { Button } from '../ui/Button';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

const CartPage: React.FC = () => {
  const { cart, removeItem, updateQuantity, applyDiscountCode, isLoading } = useCartContext();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-50 dark:bg-charcoal-900 flex items-center justify-center">
        <div className="text-charcoal-800 dark:text-cream-100">Loading cart...</div>
      </div>
    );
  }

  const itemCount = cart.items.reduce((count, item) => count + item.quantity, 0);
  // avoid nested ternary by extracting pluralization and message into separate constants
  const pluralSuffix = itemCount === 1 ? '' : 's';
  const cartMessage =
    cart.items.length === 0 ? 'Your cart is empty' : `${itemCount} item${pluralSuffix} in your cart`;

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-charcoal-900 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <a href="/services">
              <Button variant="ghost" size="md">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Continue Shopping
              </Button>
            </a>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <svg className="w-8 h-8 text-coral-500 dark:text-coral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h1 className="text-4xl font-bold text-charcoal-800 dark:text-cream-100">Your Cart</h1>
          </div>

          <p className="text-charcoal-700 dark:text-cream-300 text-lg">
            {cartMessage}
          </p>
        </div>

        {/* Cart Content */}
        {cart.items.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-cream-100 dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-700 rounded-2xl p-12 max-w-md mx-auto">
              <div className="w-24 h-24 bg-coral-500/20 dark:bg-coral-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-coral-500 dark:text-coral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>

              <h2 className="text-2xl font-semibold text-charcoal-800 dark:text-cream-100 mb-4">
                Your cart is empty
              </h2>

              <p className="text-charcoal-700 dark:text-cream-300 mb-8">
                Looks like you haven&apos;t added any subscriptions yet.
                Discover amazing deals on premium services!
              </p>

              <a href="/services">
                <Button variant="primary" size="lg" fullWidth>
                  Browse Services
                </Button>
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeItem}
                />
              ))}

              <div className="mt-6">
                <a href="/services">
                  <Button variant="outline" size="md">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Continue Shopping
                  </Button>
                </a>
              </div>
            </div>

            <div className="lg:col-span-1">
              <CartSummary
                cart={cart}
                onApplyDiscount={applyDiscountCode}
              />
            </div>
          </div>
        )}

        {/* Trust Indicators */}
        {cart.items.length > 0 && (
          <div className="mt-12">
            <div className="bg-cream-100 dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-700 rounded-2xl p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-coral-500/20 dark:bg-coral-400/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-coral-500 dark:text-coral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-charcoal-800 dark:text-cream-100 font-medium">Secure Payment</p>
                    <p className="text-charcoal-600 dark:text-cream-400 text-sm">256-bit SSL encryption</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-purple-500/20 dark:bg-purple-400/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-charcoal-800 dark:text-cream-100 font-medium">Instant Delivery</p>
                    <p className="text-charcoal-600 dark:text-cream-400 text-sm">Get access within minutes</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-coral-500/20 dark:bg-coral-400/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-coral-500 dark:text-coral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-charcoal-800 dark:text-cream-100 font-medium">24/7 Support</p>
                    <p className="text-charcoal-600 dark:text-cream-400 text-sm">We&apos;re here to help</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
