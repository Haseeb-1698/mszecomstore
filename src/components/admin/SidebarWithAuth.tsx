import { SupabaseAuthProvider } from '../../contexts/SupabaseAuthContext';
import Sidebar from './Sidebar';

export default function SidebarWithAuth() {
  return (
    <SupabaseAuthProvider>
      <Sidebar />
    </SupabaseAuthProvider>
  );
}