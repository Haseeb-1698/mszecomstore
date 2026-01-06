import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { SettingsTab } from './SettingsTabs';

const SettingsForm: React.FC = () => {
  const [activeTab] = useState<SettingsTab>('business');
  const [businessInfo, setBusinessInfo] = useState({
    businessName: 'MSZ Ecom Store',
    email: 'contact@mszecom.com',
    phone: '+92 300 1234567',
    address: 'Karachi, Pakistan',
    description: 'Premium subscription services at affordable prices'
  });

  const [paymentSettings, setPaymentSettings] = useState({
    stripePublishableKey: '',
    stripeSecretKey: '',
    easyPaisaNumber: '+92 300 1234567',
    jazzCashNumber: '+92 300 1234567',
    bankName: 'HBL Bank',
    accountNumber: '12345678901234'
  });

  const [notifications, setNotifications] = useState({
    orderConfirmation: true,
    orderStatusUpdate: true,
    paymentReceived: true,
    newCustomer: false,
    lowStock: true,
    weeklyReport: true
  });

  const handleBusinessChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBusinessInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving settings:', { businessInfo, paymentSettings, notifications });
    alert('Settings saved successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-cream-50 dark:bg-charcoal-800 rounded-2xl border border-cream-400 dark:border-charcoal-700 p-6">
      {/* Business Info Tab */}
      {activeTab === 'business' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-charcoal-800 dark:text-cream-100 mb-4">Business Information</h3>
            <p className="text-sm text-charcoal-600 dark:text-cream-400 mb-6">
              Update your business details that will be displayed to customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 dark:text-cream-300 mb-2">
                Business Name *
              </label>
              <Input
                type="text"
                name="businessName"
                value={businessInfo.businessName}
                onChange={handleBusinessChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal-700 dark:text-cream-300 mb-2">
                Email *
              </label>
              <Input
                type="email"
                name="email"
                value={businessInfo.email}
                onChange={handleBusinessChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal-700 dark:text-cream-300 mb-2">
                Phone *
              </label>
              <Input
                type="tel"
                name="phone"
                value={businessInfo.phone}
                onChange={handleBusinessChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal-700 dark:text-cream-300 mb-2">
                Address
              </label>
              <Input
                type="text"
                name="address"
                value={businessInfo.address}
                onChange={handleBusinessChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-700 dark:text-cream-300 mb-2">
              Business Description
            </label>
            <textarea
              name="description"
              value={businessInfo.description}
              onChange={handleBusinessChange}
              rows={4}
              className="w-full px-4 py-2 bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500 text-charcoal-800 dark:text-cream-100 resize-none"
            />
          </div>
        </div>
      )}

      {/* Payment Settings Tab */}
      {activeTab === 'payment' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-charcoal-800 dark:text-cream-100 mb-4">Payment Settings</h3>
            <p className="text-sm text-charcoal-600 dark:text-cream-400 mb-6">
              Configure your payment gateway credentials (All fields are encrypted)
            </p>
          </div>

          {/* Stripe Settings */}
          <div className="p-4 bg-cream-100 dark:bg-charcoal-900 rounded-xl">
            <h4 className="font-semibold text-charcoal-800 dark:text-cream-100 mb-4">Stripe (Coming Soon)</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal-700 dark:text-cream-300 mb-2">
                  Publishable Key
                </label>
                <Input
                  type="text"
                  name="stripePublishableKey"
                  value={paymentSettings.stripePublishableKey}
                  onChange={handlePaymentChange}
                  placeholder="pk_test_..."
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 dark:text-cream-300 mb-2">
                  Secret Key
                </label>
                <Input
                  type="password"
                  name="stripeSecretKey"
                  value={paymentSettings.stripeSecretKey}
                  onChange={handlePaymentChange}
                  placeholder="sk_test_..."
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Local Payment Methods */}
          <div className="p-4 bg-cream-100 dark:bg-charcoal-900 rounded-xl">
            <h4 className="font-semibold text-charcoal-800 dark:text-cream-100 mb-4">Local Payment Methods</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal-700 dark:text-cream-300 mb-2">
                  EasyPaisa Number
                </label>
                <Input
                  type="tel"
                  name="easyPaisaNumber"
                  value={paymentSettings.easyPaisaNumber}
                  onChange={handlePaymentChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 dark:text-cream-300 mb-2">
                  JazzCash Number
                </label>
                <Input
                  type="tel"
                  name="jazzCashNumber"
                  value={paymentSettings.jazzCashNumber}
                  onChange={handlePaymentChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 dark:text-cream-300 mb-2">
                    Bank Name
                  </label>
                  <Input
                    type="text"
                    name="bankName"
                    value={paymentSettings.bankName}
                    onChange={handlePaymentChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 dark:text-cream-300 mb-2">
                    Account Number
                  </label>
                  <Input
                    type="text"
                    name="accountNumber"
                    value={paymentSettings.accountNumber}
                    onChange={handlePaymentChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-charcoal-800 dark:text-cream-100 mb-4">Email Notifications</h3>
            <p className="text-sm text-charcoal-600 dark:text-cream-400 mb-6">
              Choose which email notifications you want to receive
            </p>
          </div>

          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-4 bg-cream-100 dark:bg-charcoal-900 rounded-xl"
              >
                <div>
                  <h4 className="font-medium text-charcoal-800 dark:text-cream-100">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </h4>
                  <p className="text-sm text-charcoal-600 dark:text-cream-400 mt-1">
                    {getNotificationDescription(key)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotificationToggle(key as keyof typeof notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Theme Tab */}
      {activeTab === 'theme' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-charcoal-800 dark:text-cream-100 mb-4">Theme Preferences</h3>
            <p className="text-sm text-charcoal-600 dark:text-cream-400 mb-6">
              Customize the appearance of your admin panel
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
              }}
              className="p-6 border-2 border-cream-400 dark:border-charcoal-700 rounded-xl hover:border-coral-500 transition-colors text-center"
            >
              <svg className="w-12 h-12 mx-auto mb-3 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h4 className="font-semibold text-charcoal-800 dark:text-cream-100">Light Mode</h4>
              <p className="text-sm text-charcoal-600 dark:text-cream-400 mt-2">Bright and clean interface</p>
            </button>

            <button
              type="button"
              onClick={() => {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
              }}
              className="p-6 border-2 border-cream-400 dark:border-charcoal-700 rounded-xl hover:border-coral-500 transition-colors text-center"
            >
              <svg className="w-12 h-12 mx-auto mb-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <h4 className="font-semibold text-charcoal-800 dark:text-cream-100">Dark Mode</h4>
              <p className="text-sm text-charcoal-600 dark:text-cream-400 mt-2">Easy on the eyes</p>
            </button>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="mt-8 pt-6 border-t border-cream-400 dark:border-charcoal-700">
        <Button type="submit" variant="primary" size="lg">
          Save Settings
        </Button>
      </div>
    </form>
  );
};

function getNotificationDescription(key: string): string {
  const descriptions: Record<string, string> = {
    orderConfirmation: 'Receive email when a new order is placed',
    orderStatusUpdate: 'Get notified when order status changes',
    paymentReceived: 'Notification when payment is received',
    newCustomer: 'Alert when a new customer registers',
    lowStock: 'Warning when service capacity is low',
    weeklyReport: 'Weekly summary of sales and orders'
  };
  return descriptions[key] || '';
}

export default SettingsForm;
