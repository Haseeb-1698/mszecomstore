import React from 'react';
import { AppProviders } from '../../providers/AppProviders';
import CustomerDashboard from './CustomerDashboard';

/**
 * DashboardWrapper - Wraps CustomerDashboard with necessary providers
 * This ensures the SupabaseAuthProvider is available for useSupabaseAuth hook
 */
const DashboardWrapper: React.FC = () => {
  return (
    <AppProviders includeCart={false}>
      <CustomerDashboard />
    </AppProviders>
  );
};

export default DashboardWrapper;