import React, { useState, useEffect } from 'react';
import ServiceForm from './ServiceForm';

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

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  service: Service | null;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, onSuccess, service }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${isClosing ? 'opacity-0' : 'opacity-100'
        }`}
    >
      {/* Backdrop */}
      <button
        className="absolute inset-0 bg-charcoal-900/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-cream-50 dark:bg-charcoal-800 rounded-2xl shadow-soft-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-cream-400 dark:border-charcoal-700 transition-transform duration-200 ${isClosing ? 'scale-95' : 'scale-100'
          }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-cream-50 dark:bg-charcoal-800 border-b border-cream-400 dark:border-charcoal-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-charcoal-800 dark:text-cream-100">
            {service ? 'Edit Service' : 'Add New Service'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-cream-200 dark:hover:bg-charcoal-700 text-charcoal-600 dark:text-cream-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <ServiceForm service={service} onClose={handleClose} onSuccess={onSuccess} />
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
