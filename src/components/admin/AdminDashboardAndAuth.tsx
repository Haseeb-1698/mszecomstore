import { SupabaseAuthProvider } from '../../contexts/SupabaseAuthContext';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import StatsCard from './StatsCard';
import RecentOrders from './RecentOrders';

export default function AdminDashboardAndAuth() {
  return (
    <SupabaseAuthProvider>
      <ProtectedRoute requireAdmin={true}>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard 
              title="Total Orders" 
              value="0" 
              change="+0%" 
              trend="up" 
              icon="orders" 
            />
            <StatsCard 
              title="Revenue" 
              value="$0" 
              change="+0%" 
              trend="up" 
              icon="revenue" 
            />
            <StatsCard 
              title="Active Subscriptions" 
              value="0" 
              change="+0%" 
              trend="up" 
              icon="customers" 
            />
            <StatsCard 
              title="Services" 
              value="0" 
              change="+0%" 
              trend="up" 
              icon="services" 
            />
          </div>
          
          <RecentOrders />
        </div>
      </ProtectedRoute>
    </SupabaseAuthProvider>
  );
}
