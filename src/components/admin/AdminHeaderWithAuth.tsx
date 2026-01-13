import { SupabaseAuthProvider } from '../../contexts/SupabaseAuthContext';
import AdminHeader from './AdminHeader';

export default function AdminHeaderWithAuth() {
  return (
    <SupabaseAuthProvider>
      <AdminHeader />
    </SupabaseAuthProvider>
  );
}