import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface Service {
  id: string;
  name: string;
  category: string;
  price: string;
  duration: string;
  active: boolean;
  totalSales: number;
  description: string;
}

interface ServiceFormProps {
  service: Service | null;
  onClose: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ service, onClose }) => {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    category: service?.category || 'Streaming',
    price: service?.price || '',
    duration: service?.duration || '1 Month',
    description: service?.description || '',
    active: service?.active ?? true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log('Submitting service:', formData);
    // In a real app, this would make an API call
    alert(`Service ${service ? 'updated' : 'created'} successfully!`);
    onClose();
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

      {/* Category & Duration */}
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
          <label htmlFor="duration" className="block text-sm font-medium text-charcoal-700 dark:text-cream-300 mb-2">
            Duration *
          </label>
          <select
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500 text-charcoal-800 dark:text-cream-100"
          >
            <option value="1 Month">1 Month</option>
            <option value="3 Months">3 Months</option>
            <option value="6 Months">6 Months</option>
            <option value="1 Year">1 Year</option>
          </select>
        </div>
      </div>

      {/* Price */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-charcoal-700 dark:text-cream-300 mb-2">
          Price *
        </label>
        <Input
          id="price"
          type="text"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="e.g., $15.99"
          error={errors.price}
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
          className={`w-full px-4 py-2 bg-cream-100 dark:bg-charcoal-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500 text-charcoal-800 dark:text-cream-100 resize-none ${
            errors.description
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
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            formData.active ? 'bg-green-500' : 'bg-gray-400'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              formData.active ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-cream-400 dark:border-charcoal-700">
        <Button type="submit" variant="primary" fullWidth>
          {service ? 'Update Service' : 'Create Service'}
        </Button>
        <Button type="button" variant="outline" onClick={onClose} fullWidth>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ServiceForm;
