import React, { useState } from 'react';
import AdminPageWrapper from './AdminPageWrapper';
import OrdersTable from './OrdersTable';
import OrderFilters from './OrderFilters';

/**
 * OrdersPage - Complete orders page content wrapped with admin shell.
 * This component handles all hydration in a single tree to avoid race conditions.
 */
export const OrdersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  return (
    <AdminPageWrapper requireAdmin={true}>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-charcoal-800 dark:text-cream-100 mb-2">Orders Management</h1>
            <p className="text-charcoal-600 dark:text-cream-400">View and manage all customer orders</p>
          </div>
          <button className="px-4 py-2 bg-coral-500 hover:bg-coral-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Export Orders
          </button>
        </div>

        {/* Filters */}
        <OrderFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          dateRange={dateRange}
          onSearchChange={setSearchTerm}
          onStatusChange={setStatusFilter}
          onDateRangeChange={setDateRange}
        />

        {/* Orders Table */}
        <OrdersTable
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          dateRange={dateRange}
        />
      </div>
    </AdminPageWrapper>
  );
};

export default OrdersPage;
