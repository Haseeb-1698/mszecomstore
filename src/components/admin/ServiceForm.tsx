import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useServices } from '../../hooks/useServices';

interface Service {
  id: string;
  name: string;
  category: string;
  price: string;
  duration: string;
  active: boolean;
  totalSales: number;
  description: string;
  icon_url?: string;
}

interface ServiceFormProps {
  service: Service | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ service, onClose, onSuccess }) => {
  const { createService, updateService } = useServices();
  const [formData, setFormData] = useState({
    name: service?.name || '',
    category: service?.category || 'Streaming',
    price: service?.price || '',
    description: service?.description || '',
    active: service?.active ?? true,
    iconUrl: service?.icon_url ?? ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleToggleActive = () => {
    setFormData((prev) => ({ ...prev, active: !prev.active }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required';
    }

    const priceNum = Number.parseFloat(formData.price.replaceAll(/[^0-9.]/g, ''));
    if ( Number.isNaN(priceNum)) {
      newErrors.price = 'Valid price is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const serviceData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        is_active: formData.active,
        icon_url: formData.iconUrl
      };

      const priceNum = Number.parseFloat(formData.price.replaceAll(/[^0-9.]/g, ''));

      const plansData = [
        {
          name: 'Basic',
          tier: 'basic',
          duration_months: 1,
          price: priceNum,
          type: 'dedicated' as const,
          is_available: true,
          display_order: 1,
          description: '1 month subscription with full access'
        },
        {
          name: 'Standard',
          tier: 'standard',
          duration_months: 3,
          price: Math.round(priceNum * 3 * 0.9), // 10% discount for 3 months
          type: 'dedicated' as const,
          is_available: true,
          is_popular: true,
          display_order: 2,
          badge: 'popular',
          description: '3 months subscription with 10% discount'
        },
        {
          name: 'Premium',
          tier: 'premium',
          duration_months: 12,
          price: Math.round(priceNum * 12 * 0.75), // 25% discount for 12 months
          type: 'dedicated' as const,
          is_available: true,
          display_order: 3,
          badge: 'best_value',
          description: '12 months subscription with 25% discount'
        }
      ];

      let result;
      if (service) {
        result = await updateService(service.id, serviceData, plansData);
      } else {
        result = await createService(serviceData, plansData);
      }

      if (result.error) {
        alert(`Error: ${result.error}`);
      } else {
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Service Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-charcoal-700 dark:text-cream-300 mb-2">
          Service Name *
        </label>
        <Input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Netflix Premium"
          error={errors.name}
        />
      </div>

      {/* Category & Base Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-charcoal-700 dark:text-cream-300 mb-2">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500 text-charcoal-800 dark:text-cream-100"
          >
            <option value="Streaming">Streaming</option>
            <option value="Music">Music</option>
            <option value="Gaming">Gaming</option>
            <option value="Productivity">Productivity</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-charcoal-700 dark:text-cream-300 mb-2">
            Base Price (Rs) *
          </label>
          <Input
            id="price"
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price for 1 month"
            error={errors.price}
          />
        </div>
      </div>

      {/* Icon URL */}
      <div>
        <label htmlFor="iconUrl" className="block text-sm font-medium text-charcoal-700 dark:text-cream-300 mb-2">
          Icon URL
        </label>
        <Input
          id="iconUrl"
          type="text"
          name="iconUrl"
          value={formData.iconUrl}
          onChange={handleChange}
          placeholder="e.g., /icons/netflix.svg"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-charcoal-700 dark:text-cream-300 mb-2">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the service and what's included..."
          rows={4}
          className={`w-full px-4 py-2 bg-cream-100 dark:bg-charcoal-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500 text-charcoal-800 dark:text-cream-100 resize-none ${errors.description
            ? 'border-red-500 focus:ring-red-500'
            : 'border-cream-400 dark:border-charcoal-700'
            }`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
        )}
      </div>

      {/* Active Status */}
      <div className="flex items-center justify-between p-4 bg-cream-100 dark:bg-charcoal-900 rounded-xl">
        <div>
          <h4 className="text-sm font-medium text-charcoal-800 dark:text-cream-100">Active Status</h4>
          <p className="text-xs text-charcoal-600 dark:text-cream-400 mt-1">
            {formData.active ? 'Service is visible to customers' : 'Service is hidden from customers'}
          </p>
        </div>
        <button
          type="button"
          onClick={handleToggleActive}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.active ? 'bg-green-500' : 'bg-gray-400'
            }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.active ? 'translate-x-6' : 'translate-x-1'
              }`}
          />
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-cream-400 dark:border-charcoal-700">
        <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
          {(() => {
            if (isSubmitting) return 'Processing...';
            return service ? 'Update Service' : 'Create Service';
          })()}
        </Button>
        <Button type="button" variant="outline" onClick={onClose} fullWidth>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ServiceForm;
