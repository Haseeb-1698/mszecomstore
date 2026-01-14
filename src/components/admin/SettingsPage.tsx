import React from 'react';
import AdminPageWrapper from './AdminPageWrapper';
import SettingsTabs from './SettingsTabs';
import SettingsForm from './SettingsForm';

/**
 * SettingsPage - Complete settings page content wrapped with admin shell.
 * This component handles all hydration in a single tree to avoid race conditions.
 */
export const SettingsPage: React.FC = () => {
  return (
    <AdminPageWrapper requireAdmin={true}>
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal-800 dark:text-cream-100 mb-2">Settings</h1>
          <p className="text-charcoal-600 dark:text-cream-400">Manage your store settings and preferences</p>
        </div>

        {/* Tabs & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <SettingsTabs />
          </div>

          {/* Form Content */}
          <div className="lg:col-span-3">
            <SettingsForm />
          </div>
        </div>
      </div>
    </AdminPageWrapper>
  );
};

export default SettingsPage;
