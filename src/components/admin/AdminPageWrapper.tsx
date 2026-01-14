import React, { type ReactNode } from 'react';
import AdminShell from './AdminShell';

interface AdminPageWrapperProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

/**
 * AdminPageWrapper - Complete admin page wrapper with shell and providers.
 * Use this as the single client:only="react" component in admin .astro pages.
 * This prevents hydration race conditions by ensuring all React components
 * share the same context and hydrate together.
 * 
 * Note: ProtectedRoute removed - authentication will be handled separately.
 */
export const AdminPageWrapper: React.FC<AdminPageWrapperProps> = ({ 
  children, 
  requireAdmin = true 
}) => {
  return (
    <AdminShell>
      {children}
    </AdminShell>
  );
};

export default AdminPageWrapper;
