import React from 'react';
import AdminPageWrapper from './AdminPageWrapper';
import CustomersTable from './CustomersTable';

/**
 * CustomersPage - Complete customers page content wrapped with admin shell.
 * This component handles all hydration in a single tree to avoid race conditions.
 */
export const CustomersPage: React.FC = () => {
  return (
    <AdminPageWrapper requireAdmin={true}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-charcoal-800 dark:text-cream-100">Customers</h1>
        <p className="text-charcoal-600 dark:text-cream-400">Manage and view all registered customers</p>

        <CustomersTable />
      </div>
    </AdminPageWrapper>
  );
};

export default CustomersPage;
