import React, { type ReactNode } from 'react';
import AdminShell from './AdminShell';
import { ProtectedRoute } from '../auth/ProtectedRoute';

interface AdminPageWrapperProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

/**
 * AdminPageWrapper - Complete admin page wrapper with shell, providers, and protection.
 * Use this as the single client:only="react" component in admin .astro pages.
 * This prevents hydration race conditions by ensuring all React components
 * share the same context and hydrate together.
 */
export const AdminPageWrapper: React.FC<AdminPageWrapperProps> = ({ 
  children, 
  requireAdmin = true 
}) => {
  return (
    <AdminShell>
      <ProtectedRoute requireAdmin={requireAdmin}>
        {children}
      </ProtectedRoute>
    </AdminShell>
  );
};

export default AdminPageWrapper;
