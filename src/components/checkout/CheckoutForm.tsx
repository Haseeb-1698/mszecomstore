import React from 'react';
import { Input, TextArea } from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface CustomerInfo {
  name: string;
  email: string;
  whatsapp: string;
  instructions: string;
}

interface CheckoutFormProps {
  customerInfo: CustomerInfo;
  setCustomerInfo: React.Dispatch<React.SetStateAction<CustomerInfo>>;
  errors: { [key: string]: string };
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  customerInfo,
  setCustomerInfo,
  errors,
  setErrors
}) => {
  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Card variant="elevated" className="bg-cream-100 dark:bg-charcoal-800 border-cream-400 dark:border-charcoal-700">
      <CardHeader>
        <CardTitle className="text-charcoal-900 dark:text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-coral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Contact Information
        </CardTitle>
        <p className="text-sm text-charcoal-600 dark:text-cream-400">
          We'll use this information to deliver your subscription details
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="Ahmed Hassan"
            value={customerInfo.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            fullWidth
            required
            className="bg-cream-50 dark:bg-charcoal-700 border-cream-300 dark:border-charcoal-600"
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="ahmed.hassan@email.com"
            value={customerInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            fullWidth
            required
            className="bg-cream-50 dark:bg-charcoal-700 border-cream-300 dark:border-charcoal-600"
          />
        </div>

        <Input
          label="WhatsApp Number"
          type="tel"
          placeholder="+92 300 1234567"
          value={customerInfo.whatsapp}
          onChange={(e) => handleInputChange('whatsapp', e.target.value)}
          error={errors.whatsapp}
          helperText="Account credentials will be sent to this WhatsApp number"
          fullWidth
          required
          className="bg-cream-50 dark:bg-charcoal-700 border-cream-300 dark:border-charcoal-600"
        />

        <TextArea
          label="Special Instructions (Optional)"
          placeholder="Any specific requirements, preferred delivery time, or additional notes..."
          value={customerInfo.instructions}
          onChange={(e) => handleInputChange('instructions', e.target.value)}
          rows={4}
          fullWidth
          className="bg-cream-50 dark:bg-charcoal-700 border-cream-300 dark:border-charcoal-600"
        />

        {/* Information Notice */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                Important Information
              </h4>
              <ul className="text-xs text-yellow-700 dark:text-yellow-400 space-y-1">
                <li>• Account details will be delivered within 5-10 minutes</li>
                <li>• Make sure your WhatsApp number is active and correct</li>
                <li>• Check your email for order confirmation and receipt</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutForm;
