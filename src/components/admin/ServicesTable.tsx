import React, { useState } from 'react';
import ServiceModal from './ServiceModal';
import ConfirmModal from './ConfirmModal';
import { useServices } from '../../hooks/useServices';
import { formatPrice } from '../../lib/utils';

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

const ServicesTable: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { services: dbServices, toggleActiveStatus, deleteService, refresh } = useServices();

  const getDuration = (plan: typeof dbServices[0]['plans'][0] | undefined): string => {
    if (!plan) return 'N/A';
    const months = plan.duration_months;
    const suffix = months === 1 ? '' : 's';
    return `${months} Month${suffix}`;
  };

  const services: Service[] = dbServices.map(s => {
    const defaultPlan = s.plans?.[0];
    return {
      id: s.id,
      name: s.name,
      category: s.category,
      price: defaultPlan ? formatPrice(defaultPlan.price) : 'N/A',
      duration: getDuration(defaultPlan),
      active: s.is_active,
      totalSales: 0, // In a real app, this would come from a view or aggregation
      description: s.description || ''
    };
  });

  const handleToggleActive = async (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      await toggleActiveStatus(serviceId, service.active);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (serviceId: string) => {
    setServiceToDelete(serviceId);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (serviceToDelete) {
      setIsDeleting(true);
      try {
        await deleteService(serviceToDelete);
        setIsConfirmOpen(false);
      } finally {
        setIsDeleting(false);
        setServiceToDelete(null);
      }
    }
  };

  const handleAddNew = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="bg-cream-50 dark:bg-charcoal-800 rounded-2xl border border-cream-400 dark:border-charcoal-700 overflow-hidden">
        {/* Stats Summary */}
        <div className="bg-cream-200 dark:bg-charcoal-900 px-6 py-4 grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-charcoal-600 dark:text-cream-400 mb-1">Total Services</p>
            <p className="text-2xl font-bold text-charcoal-800 dark:text-cream-100">{services.length}</p>
          </div>
          <div>
            <p className="text-xs text-charcoal-600 dark:text-cream-400 mb-1">Active Services</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {services.filter(s => s.active).length}
            </p>
          </div>
          <div>
            <p className="text-xs text-charcoal-600 dark:text-cream-400 mb-1">Total Sales</p>
            <p className="text-2xl font-bold text-coral-600 dark:text-coral-400">
              {services.reduce((sum, s) => sum + s.totalSales, 0)}
            </p>
          </div>
        </div>

        {/* Add New Button */}
        <div className="px-6 py-4 border-b border-cream-400 dark:border-charcoal-700">
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-coral-500 hover:bg-coral-600 text-white rounded-lg font-medium transition-colors"
          >
            Add New Service
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream-200 dark:bg-charcoal-900">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-charcoal-700 dark:text-cream-300">Service</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-charcoal-700 dark:text-cream-300">Category</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-charcoal-700 dark:text-cream-300">Price</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-charcoal-700 dark:text-cream-300">Duration</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-charcoal-700 dark:text-cream-300">Sales</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-charcoal-700 dark:text-cream-300">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-charcoal-700 dark:text-cream-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr
                  key={service.id}
                  className={`border-t border-cream-400 dark:border-charcoal-700 hover:bg-cream-100 dark:hover:bg-charcoal-700 transition-colors ${index % 2 === 0 ? 'bg-cream-50 dark:bg-charcoal-800' : 'bg-cream-100 dark:bg-charcoal-900'
                    }`}
                >
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm font-medium text-charcoal-800 dark:text-cream-100">{service.name}</p>
                      <p className="text-xs text-charcoal-600 dark:text-cream-400">{service.id}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-xs font-medium">
                      {service.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm font-semibold text-charcoal-800 dark:text-cream-100">{service.price}</td>
                  <td className="py-4 px-6 text-sm text-charcoal-700 dark:text-cream-300">{service.duration}</td>
                  <td className="py-4 px-6 text-sm text-charcoal-700 dark:text-cream-300">{service.totalSales}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleToggleActive(service.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${service.active ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${service.active ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="p-2 rounded-lg hover:bg-cream-200 dark:hover:bg-charcoal-600 text-purple-600 dark:text-purple-400 transition-colors"
                        title="Edit service"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(service.id)}
                        className="p-2 rounded-lg hover:bg-cream-200 dark:hover:bg-charcoal-600 text-red-600 dark:text-red-400 transition-colors"
                        title="Delete service"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refresh}
        service={editingService}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Service"
        message="Are you sure you want to delete this service? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
};

export default ServicesTable;
