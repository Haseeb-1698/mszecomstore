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
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={customerInfo.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={errors.name}
          fullWidth
          required
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          value={customerInfo.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={errors.email}
          fullWidth
          required
        />

        <Input
          label="WhatsApp Number"
          type="tel"
          placeholder="+92 300 1234567"
          value={customerInfo.whatsapp}
          onChange={(e) => handleInputChange('whatsapp', e.target.value)}
          error={errors.whatsapp}
          helperText="We'll send order updates on WhatsApp"
          fullWidth
          required
        />

        <TextArea
          label="Special Instructions (Optional)"
          placeholder="Any special requirements or notes..."
          value={customerInfo.instructions}
          onChange={(e) => handleInputChange('instructions', e.target.value)}
          rows={4}
          fullWidth
        />
      </CardContent>
    </Card>
  );
};

export default CheckoutForm;
