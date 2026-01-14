import React from 'react';
import AdminPageWrapper from './AdminPageWrapper';
import AdminDashboard from './AdminDashboard';
import RecentOrders from './RecentOrders';

/**
 * DashboardPage - Complete dashboard page content wrapped with admin shell.
 * This component handles all hydration in a single tree to avoid race conditions.
 */
export const DashboardPage: React.FC = () => {
  return (
    <AdminPageWrapper requireAdmin={true}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-charcoal-800 dark:text-cream-100">Dashboard Overview</h1>
        
        <AdminDashboard />
        
        <RecentOrders />
      </div>
    </AdminPageWrapper>
  );
};

export default DashboardPage;
