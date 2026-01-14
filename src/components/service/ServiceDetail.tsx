import React, { useState } from 'react';
import AddToCartButton from './AddToCartButton';
import { formatPrice } from '../../lib/utils';

interface Plan {
  id: string;
  name: string;
  tier?: string;
  duration_months: number;
  price: number;
  original_price?: number;
  savings?: number;
  features?: string[];
  is_popular?: boolean;
  is_available?: boolean;
  badge?: string;
  description?: string;
}

interface ServiceDetailProps {
  serviceId: string;
  serviceName: string;
  serviceDescription: string;
  serviceLongDescription?: string;
  serviceIcon?: string;
  plans: Plan[];
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({
  serviceId,
  serviceName,
  serviceDescription,
  serviceLongDescription,
  serviceIcon,
  plans
}) => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(
    plans.find(p => p.is_popular) || plans[0] || null
  );
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleAddToCart = () => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // Group plans by tier if available
  const sortedPlans = [...plans].sort((a, b) => {
    const tierOrder: Record<string, number> = { basic: 1, standard: 2, premium: 3 };
    const tierA = tierOrder[a.tier || ''] || a.duration_months;
    const tierB = tierOrder[b.tier || ''] || b.duration_months;
    return tierA - tierB;
  });

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-charcoal-900">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Success Toast */}
        {showSuccessMessage && (
          <div className="fixed top-24 right-6 z-50 animate-fade-in">
            <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">Added to cart!</span>
              <a href="/cart" className="underline hover:no-underline">View Cart</a>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
          {/* Service Info */}
          <div className="flex flex-col items-start">
            {serviceIcon && (
              <img 
                src={serviceIcon} 
                alt={serviceName} 
                className="h-20 w-auto mb-6"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/icons/default-service.svg';
                }}
              />
            )}
            <h1 className="text-5xl sm:text-6xl font-bold text-charcoal-900 dark:text-white tracking-tighter">
              {serviceName}
            </h1>
            <p className="mt-4 text-xl text-charcoal-800/80 dark:text-gray-300">
              {serviceLongDescription || serviceDescription}
            </p>
            
            {/* Quick features if plan has them */}
            {selectedPlan?.features && selectedPlan.features.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-charcoal-900 dark:text-white mb-4">
                  What's included:
                </h3>
                <ul className="space-y-2">
                  {selectedPlan.features.slice(0, 5).map((feature, index) => (
                    <li key={`feature-${feature}-${index}`} className="flex items-center gap-3 text-charcoal-700 dark:text-cream-300">
                      <svg className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Pricing Card */}
          <div className="bg-white dark:bg-charcoal-800 rounded-2xl p-8 border border-cream-400 dark:border-charcoal-700 shadow-soft sticky top-24">
            <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white tracking-tighter mb-6">
              Choose Your Plan
            </h2>
            
            {sortedPlans.length > 0 ? (
              <div className="space-y-4">
                {/* Plan Selection */}
                <div className="space-y-3">
                  {sortedPlans.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selectedPlan?.id === plan.id
                          ? 'border-coral-500 bg-coral-50 dark:bg-coral-900/20'
                          : 'border-cream-300 dark:border-charcoal-600 hover:border-coral-300 dark:hover:border-coral-700'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-charcoal-900 dark:text-white">
                              {plan.name || `${plan.duration_months} Month${plan.duration_months > 1 ? 's' : ''}`}
                            </span>
                            {plan.is_popular && (
                              <span className="px-2 py-0.5 bg-coral-500 text-white text-xs font-medium rounded-full">
                                Popular
                              </span>
                            )}
                            {plan.badge === 'best_value' && (
                              <span className="px-2 py-0.5 bg-purple-500 text-white text-xs font-medium rounded-full">
                                Best Value
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-charcoal-600 dark:text-cream-400 mt-1">
                            {plan.duration_months} month{plan.duration_months > 1 ? 's' : ''} subscription
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-charcoal-900 dark:text-white">
                            {formatPrice(plan.price)}
                          </div>
                          {plan.original_price && plan.original_price > plan.price && (
                            <div className="text-sm text-charcoal-500 dark:text-cream-500 line-through">
                              {formatPrice(plan.original_price)}
                            </div>
                          )}
                          <div className="text-xs text-charcoal-500 dark:text-cream-500">
                            {formatPrice(plan.price / plan.duration_months)}/mo
                          </div>
                        </div>
                      </div>
                      {plan.savings && plan.savings > 0 && (
                        <div className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">
                          Save {formatPrice(plan.savings)}!
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-cream-300 dark:border-charcoal-600 pt-4">
                  {selectedPlan && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-charcoal-600 dark:text-cream-400 mb-2">
                        <span>Selected Plan</span>
                        <span>{selectedPlan.name || `${selectedPlan.duration_months} Months`}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-charcoal-900 dark:text-white">
                        <span>Total</span>
                        <span>{formatPrice(selectedPlan.price)}</span>
                      </div>
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  {selectedPlan && (
                    <AddToCartButton
                      serviceId={serviceId}
                      serviceName={serviceName}
                      plan={selectedPlan}
                      onAddToCart={handleAddToCart}
                    />
                  )}
                </div>

                {/* Trust Badges */}
                <div className="pt-4 border-t border-cream-300 dark:border-charcoal-600">
                  <div className="flex items-center justify-center gap-6 text-xs text-charcoal-500 dark:text-cream-500">
                    <div className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>Secure</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Instant</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span>24/7 Support</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-charcoal-600 dark:text-cream-400">
                <p>No plans available for this service yet.</p>
                <p className="text-sm mt-2">Check back soon!</p>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-cream-100 dark:bg-charcoal-800 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-charcoal-900 dark:text-white text-center mb-12">
            Why Subscribe to {serviceName} with MSZ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-charcoal-700 p-6 rounded-xl border border-cream-300 dark:border-charcoal-600">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-charcoal-900 dark:text-white mb-2">Consolidated Billing</h3>
              <p className="text-charcoal-600 dark:text-cream-400 text-sm">
                Manage all your subscriptions in one place with a single monthly bill.
              </p>
            </div>
            <div className="bg-white dark:bg-charcoal-700 p-6 rounded-xl border border-cream-300 dark:border-charcoal-600">
              <div className="w-12 h-12 bg-coral-100 dark:bg-coral-900/30 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-coral-600 dark:text-coral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-charcoal-900 dark:text-white mb-2">Exclusive Savings</h3>
              <p className="text-charcoal-600 dark:text-cream-400 text-sm">
                Unlock special discounts and bundle offers you won't find anywhere else.
              </p>
            </div>
            <div className="bg-white dark:bg-charcoal-700 p-6 rounded-xl border border-cream-300 dark:border-charcoal-600">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-charcoal-900 dark:text-white mb-2">Flexible Management</h3>
              <p className="text-charcoal-600 dark:text-cream-400 text-sm">
                Easily upgrade, downgrade, or pause your subscription at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
