import React, { useState, useCallback } from 'react';
import AdminPageWrapper from './AdminPageWrapper';
import ServicesTable from './ServicesTable';
import ServiceModal from './ServiceModal';

/**
 * ServicesPage - Complete services page content wrapped with admin shell.
 * This component handles all hydration in a single tree to avoid race conditions.
 */
export const ServicesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleSuccess = useCallback(() => {
    setIsModalOpen(false);
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <AdminPageWrapper requireAdmin={true}>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-charcoal-800 dark:text-cream-100 mb-2">Services Management</h1>
            <p className="text-charcoal-600 dark:text-cream-400">Manage your subscription services catalog</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-coral-500 hover:bg-coral-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Service
          </button>
        </div>

        {/* Services Table */}
        <ServicesTable key={refreshKey} />

        {/* Service Modal */}
        <ServiceModal 
          isOpen={isModalOpen} 
          onClose={handleModalClose}
          onSuccess={handleSuccess}
          service={null}
        />
      </div>
    </AdminPageWrapper>
  );
};

export default ServicesPage;
