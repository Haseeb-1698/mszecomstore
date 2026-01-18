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

// Helper function to convert service name to domain
const generateDomain = (serviceName: string): string => {
  const name = serviceName.toLowerCase().trim();
  
  // Common service name to domain mappings
  const domainMap: Record<string, string> = {
    'netflix': 'netflix.com',
    'spotify': 'spotify.com',
    'youtube': 'youtube.com',
    'amazon': 'amazon.com',
    'disney': 'disneyplus.com',
    'disney plus': 'disneyplus.com',
    'disney+': 'disneyplus.com',
    'hulu': 'hulu.com',
    'apple music': 'apple.com',
    'google': 'google.com',
    'google drive': 'google.com',
    'microsoft': 'microsoft.com',
    'microsoft 365': 'microsoft.com',
    'adobe': 'adobe.com',
    'slack': 'slack.com',
    'notion': 'notion.so',
    'figma': 'figma.com',
  };
  
  // Check if we have a mapping
  if (domainMap[name]) {
    return domainMap[name];
  }
  
  // Otherwise, clean the name and add .com
  const cleanName = name
    .replace(/[^a-z0-9\s]/g, '') // Remove special chars
    .split(' ')
    .filter(word => word.length > 0) // Remove empty strings
    .join(''); // Concatenate without spaces
  
  return cleanName ? `${cleanName}.com` : 'example.com';
};

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

  const [showCustomIcon, setShowCustomIcon] = useState(!!service?.icon_url);
  const [showDescription, setShowDescription] = useState(!!service?.description);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Generate icon URL based on provided URL or service name
  const getIconUrl = (): string => {
    if (formData.iconUrl.trim()) {
      return formData.iconUrl.trim();
    }
    
    if (!formData.name.trim()) {
      return '';
    }
    
    const domain = generateDomain(formData.name);
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  };
  
  // Get fallback icon URL using UI Avatars
  const getFallbackIconUrl = (): string => {
    const name = formData.name.trim() || 'Service';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128&background=FF6B6B&color=fff`;
  };

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
        icon_url: getIconUrl()
      };

      const priceNum = Number.parseFloat(formData.price.replaceAll(/[^0-9.]/g, ''));

      const plansData = [
        {
          name: 'Basic',
          duration_months: 1,
          price: priceNum,
          type: 'dedicated' as const,
          is_available: true,
          display_order: 1,
        },
        {
          name: 'Standard',
          duration_months: 3,
          price: Math.round(priceNum * 3 * 0.9), // 10% discount for 3 months
          type: 'dedicated' as const,
          is_available: true,
          is_popular: true,
          display_order: 2,
        },
        {
          name: 'Premium',
          duration_months: 12,
          price: Math.round(priceNum * 12 * 0.75), // 25% discount for 12 months
          type: 'dedicated' as const,
          is_available: true,
          display_order: 3,
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
      {/* Basic Information Section */}
      <div className="space-y-5">
        

        {/* Service Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-2">
            Service Name <span className="text-coral-500">*</span>
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

        {/* Category and Price Row */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-2">
              Category <span className="text-coral-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 bg-cream-50 dark:bg-charcoal-800 border-cream-400 dark:border-charcoal-700 text-charcoal-800 dark:text-cream-100 focus:border-coral-500 focus:ring-coral-500 appearance-none cursor-pointer hover:border-coral-400 dark:hover:border-coral-600"
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
            <label htmlFor="price" className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-2">
              Base Price (PKR) <span className="text-coral-500">*</span>
            </label>
            <Input
              id="price"
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="500"
              error={errors.price}
            />
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-cream-300 dark:border-charcoal-700 pb-2">
          <h3 className="text-lg font-semibold text-charcoal-800 dark:text-cream-100">Description</h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm text-charcoal-600 dark:text-cream-400">Add description</span>
            <button
              type="button"
              onClick={() => setShowDescription(!showDescription)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                showDescription ? 'bg-coral-500' : 'bg-gray-400'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showDescription ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </label>
        </div>

        {showDescription && (
          <div>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the service features and benefits..."
              rows={4}
              className={`w-full px-4 py-3 bg-cream-50 dark:bg-charcoal-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500 text-charcoal-800 dark:text-cream-100 resize-none transition-all duration-200 ${
                errors.description
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-cream-400 dark:border-charcoal-700 hover:border-coral-400 dark:hover:border-coral-600'
              }`}
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
            )}
          </div>
        )}
      </div>

      {/* Visual & Settings Section */}
      <div className="space-y-5">
        <div className="flex items-center justify-between border-b border-cream-300 dark:border-charcoal-700 pb-2">
          <h3 className="text-lg font-semibold text-charcoal-800 dark:text-cream-100">Visual & Settings</h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm text-charcoal-600 dark:text-cream-400">Custom icon</span>
            <button
              type="button"
              onClick={() => setShowCustomIcon(!showCustomIcon)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                showCustomIcon ? 'bg-coral-500' : 'bg-gray-400'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showCustomIcon ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </label>
        </div>

        {/* Icon URL */}
        {showCustomIcon && (
          <div>
            <label htmlFor="iconUrl" className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-2">
              Icon URL
            </label>
            <Input
              id="iconUrl"
              type="text"
              name="iconUrl"
              value={formData.iconUrl}
              onChange={handleChange}
              placeholder="/icons/netflix.svg or https://..."
            />
          </div>
        )}

        {/* Icon Preview and Active Status */}
        <div className="grid grid-cols-2 gap-5">
          {/* Icon Preview */}
          <div>
            <label className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-2">
              Icon Preview
            </label>
            <div className="h-32 p-4 bg-gradient-to-br from-cream-100 to-cream-200 dark:from-charcoal-900 dark:to-charcoal-800 rounded-xl border border-cream-300 dark:border-charcoal-700">
              <div className="flex items-center justify-center h-full">
                <img
                  src={getIconUrl() || getFallbackIconUrl()}
                  alt={formData.name || 'Service icon'}
                  className="h-16 w-16 rounded-lg object-contain bg-white dark:bg-charcoal-950 p-2"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getFallbackIconUrl();
                  }}
                />
              </div>
            </div>
          </div>

          {/* Active Status */}
          <div>
            <label className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-2">
              Status
            </label>
            <div className="h-32 p-4 bg-gradient-to-br from-cream-100 to-cream-200 dark:from-charcoal-900 dark:to-charcoal-800 rounded-xl border border-cream-300 dark:border-charcoal-700">
              <div className="flex flex-col items-center justify-center h-full space-y-3">
                <button
                  type="button"
                  onClick={handleToggleActive}
                  className={`relative inline-flex h-7 w-14 flex-shrink-0 items-center rounded-full transition-colors ${
                    formData.active 
                      ? 'bg-green-500' 
                      : 'bg-gray-400'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      formData.active ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  />
                </button>
                <p className="text-xs text-charcoal-600 dark:text-cream-400">
                  {formData.active ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-cream-300 dark:border-charcoal-700">
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
