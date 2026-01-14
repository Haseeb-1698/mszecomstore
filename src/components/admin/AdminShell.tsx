import React, { type ReactNode } from 'react';
import { AppProviders } from '../../providers/AppProviders';
import Sidebar from './Sidebar';
import AdminHeader from './AdminHeader';

interface AdminShellProps {
  children: ReactNode;
}

/**
 * AdminShell - Complete admin layout shell with providers.
 * This component wraps all admin content in a single provider context
 * to avoid hydration race conditions and context conflicts.
 */
export const AdminShell: React.FC<AdminShellProps> = ({ children }) => {
  return (
    <AppProviders includeCart={false}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <AdminHeader />
          
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-cream-100 dark:bg-charcoal-900 p-6">
            {children}
          </main>
        </div>
      </div>
    </AppProviders>
  );
};

export default AdminShell;
