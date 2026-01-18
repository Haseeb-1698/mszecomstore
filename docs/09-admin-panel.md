# Admin Panel

This document covers the admin panel implementation for managing the e-commerce platform.

## Overview

The admin panel provides:
- **Dashboard** - Key metrics and recent activity
- **Services Management** - CRUD for subscription services
- **Orders Management** - View and update order status
- **Customers** - View customer information
- **Settings** - Configuration options

## Access Control

### Who Can Access?

Only users with `role = 'admin'` in `user_profiles` table.

### How Access is Verified

```tsx
// AdminPageWrapper.tsx
export const AdminPageWrapper: React.FC<Props> = ({ requireAdmin = true, children }) => {
  const { user, isAdmin, isReady } = useSupabaseAuth();

  // Still loading auth state
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    window.location.href = '/login?redirect=/admin';
    return null;
  }

  // Not admin (if required)
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p>You don't have permission to access this page.</p>
          <a href="/" className="btn-primary mt-4">Go Home</a>
        </div>
      </div>
    );
  }

  // Authorized - render admin shell with children
  return <AdminShell>{children}</AdminShell>;
};
```

## Admin Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Admin Shell                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐  ┌───────────────────────────────────────────────────┐│
│  │              │  │  AdminHeader                                       ││
│  │              │  │  ┌─────────────────┐ ┌────────┐ ┌─────────────┐   ││
│  │   Sidebar    │  │  │ Search          │ │ Theme  │ │ User Menu   │   ││
│  │              │  │  └─────────────────┘ └────────┘ └─────────────┘   ││
│  │  - Dashboard │  ├───────────────────────────────────────────────────┤│
│  │  - Services  │  │                                                    ││
│  │  - Orders    │  │              Main Content Area                     ││
│  │  - Customers │  │                                                    ││
│  │  - Settings  │  │              (Page-specific content)               ││
│  │              │  │                                                    ││
│  │              │  │                                                    ││
│  │              │  │                                                    ││
│  │              │  │                                                    ││
│  └──────────────┘  └───────────────────────────────────────────────────┘│
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### AdminShell Component

```tsx
// src/components/admin/AdminShell.tsx
export const AdminShell: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AppProviders includeCart={false}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto bg-cream-100 dark:bg-charcoal-900 p-6">
            {children}
          </main>
        </div>
      </div>
    </AppProviders>
  );
};
```

### Sidebar Component

```tsx
// src/components/admin/Sidebar.tsx
const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/services', label: 'Services', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  return (
    <aside className="w-64 bg-white dark:bg-charcoal-800 border-r">
      <div className="p-6">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>
      
      <nav className="mt-6">
        {navItems.map(item => {
          const isActive = currentPath === item.href;
          const Icon = item.icon;
          
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-6 py-3 transition-colors",
                isActive
                  ? "bg-coral-500 text-white"
                  : "hover:bg-cream-100 dark:hover:bg-charcoal-700"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
};
```

## Dashboard Page

### Statistics Cards

```tsx
// AdminDashboard.tsx
interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  activeSubscriptions: number;
  totalServices: number;
  pendingOrders: number;
  deliveredToday: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({...});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    // Fetch stats from multiple sources in parallel
    const [dashboardResult, ordersResult, servicesResult] = await Promise.allSettled([
      supabase.rpc('get_admin_dashboard_stats'),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('services').select('*', { count: 'exact', head: true }).eq('is_active', true),
    ]);

    // Process results...
    setStats({ ... });
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Orders"
        value={stats.totalOrders}
        icon={<ShoppingCart />}
      />
      <StatsCard
        title="Total Revenue"
        value={formatPrice(stats.totalRevenue)}
        icon={<DollarSign />}
      />
      <StatsCard
        title="Active Services"
        value={stats.totalServices}
        icon={<Package />}
      />
      <StatsCard
        title="Pending Orders"
        value={stats.pendingOrders}
        icon={<Clock />}
        highlight={stats.pendingOrders > 0}
      />
    </div>
  );
};
```

### StatsCard Component

```tsx
// StatsCard.tsx
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
  highlight?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendUp,
  highlight
}) => {
  return (
    <div className={cn(
      "bg-white dark:bg-charcoal-800 rounded-xl p-6 border",
      highlight && "border-coral-500"
    )}>
      <div className="flex items-center justify-between">
        <div className="text-coral-500">{icon}</div>
        {trend && (
          <span className={cn(
            "text-sm",
            trendUp ? "text-green-500" : "text-red-500"
          )}>
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
    </div>
  );
};
```

### Recent Orders Widget

```tsx
// RecentOrders.tsx
const RecentOrders: React.FC = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
      .limit(5);

    setOrders(data || []);
  };

  return (
    <div className="bg-white dark:bg-charcoal-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id.slice(0, 8)}</td>
              <td>{order.customer_name}</td>
              <td>{formatPrice(order.amount)}</td>
              <td><StatusBadge status={order.status} /></td>
              <td>{formatDate(order.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

## Services Management

### Services Page

```tsx
// ServicesPage.tsx
const ServicesPage: React.FC = () => {
  const { services, loading, createService, updateService, deleteService } = useServices();
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const handleCreate = () => {
    setEditingService(null);
    setShowModal(true);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this service?')) {
      await deleteService(id);
    }
  };

  const handleSave = async (data, plans) => {
    if (editingService) {
      await updateService(editingService.id, data, plans);
    } else {
      await createService(data, plans);
    }
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Services</h1>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      <ServicesTable
        services={services}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showModal && (
        <ServiceModal
          service={editingService}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
```

### Service Form

The form handles both service details and nested plans:

```tsx
// ServiceForm.tsx
interface ServiceFormData {
  name: string;
  category: string;
  description: string;
  long_description?: string;
  icon_url?: string;
  badge?: 'popular' | 'best_value' | null;
  is_active: boolean;
}

interface PlanFormData {
  name: string;
  type: 'shared' | 'dedicated';
  tier: 'basic' | 'standard' | 'premium';
  duration_months: number;
  price: number;
  original_price?: number;
  features: string[];
  is_popular: boolean;
  is_available: boolean;
}

const ServiceForm: React.FC<Props> = ({ service, onSave, onCancel }) => {
  const [serviceData, setServiceData] = useState<ServiceFormData>({
    name: service?.name || '',
    category: service?.category || 'streaming',
    description: service?.description || '',
    // ...
  });

  const [plans, setPlans] = useState<PlanFormData[]>(
    service?.plans || [{ /* default plan */ }]
  );

  const addPlan = () => {
    setPlans([...plans, { /* new plan template */ }]);
  };

  const removePlan = (index) => {
    setPlans(plans.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(serviceData, plans);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Service fields */}
      <Input
        label="Service Name"
        value={serviceData.name}
        onChange={(e) => setServiceData({ ...serviceData, name: e.target.value })}
      />
      
      <select
        value={serviceData.category}
        onChange={(e) => setServiceData({ ...serviceData, category: e.target.value })}
      >
        <option value="streaming">Streaming</option>
        <option value="professional">Professional</option>
        {/* ... */}
      </select>

      {/* Plans section */}
      <h3>Plans</h3>
      {plans.map((plan, index) => (
        <div key={index} className="border p-4 rounded mb-4">
          <Input
            label="Plan Name"
            value={plan.name}
            onChange={(e) => {
              const newPlans = [...plans];
              newPlans[index].name = e.target.value;
              setPlans(newPlans);
            }}
          />
          {/* More plan fields... */}
          <Button type="button" onClick={() => removePlan(index)}>
            Remove Plan
          </Button>
        </div>
      ))}
      
      <Button type="button" onClick={addPlan}>Add Plan</Button>
      
      <div className="flex gap-4 mt-6">
        <Button type="submit">Save</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
};
```

## Orders Management

### Orders Page

```tsx
// OrdersPage.tsx
const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
  });

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    let query = supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters.search) {
      query = query.or(`customer_name.ilike.%${filters.search}%,customer_email.ilike.%${filters.search}%`);
    }

    const { data } = await query;
    setOrders(data || []);
    setLoading(false);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    fetchOrders();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      
      <OrderFilters
        filters={filters}
        onChange={setFilters}
      />

      <OrdersTable
        orders={orders}
        loading={loading}
        onStatusChange={updateOrderStatus}
      />
    </div>
  );
};
```

### Order Status Updates

```tsx
// In OrdersTable.tsx
const StatusDropdown: React.FC<Props> = ({ order, onStatusChange }) => {
  const statuses = ['pending', 'processing', 'completed', 'delivered', 'cancelled'];

  return (
    <select
      value={order.status}
      onChange={(e) => onStatusChange(order.id, e.target.value)}
      className={cn(
        "px-3 py-1 rounded text-sm",
        order.status === 'pending' && "bg-yellow-100 text-yellow-800",
        order.status === 'processing' && "bg-blue-100 text-blue-800",
        order.status === 'completed' && "bg-green-100 text-green-800",
        order.status === 'delivered' && "bg-purple-100 text-purple-800",
        order.status === 'cancelled' && "bg-red-100 text-red-800",
      )}
    >
      {statuses.map(status => (
        <option key={status} value={status}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </option>
      ))}
    </select>
  );
};
```

## Customers Page

View-only customer list:

```tsx
// CustomersPage.tsx
const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('role', 'customer')
      .order('created_at', { ascending: false });

    setCustomers(data || []);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Customers</h1>
      <CustomersTable customers={customers} />
    </div>
  );
};
```

## Settings Page

Configuration with tabbed interface:

```tsx
// SettingsPage.tsx
const tabs = [
  { id: 'general', label: 'General' },
  { id: 'payment', label: 'Payment' },
  { id: 'notifications', label: 'Notifications' },
];

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <SettingsTabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="mt-6">
        {activeTab === 'general' && <GeneralSettings />}
        {activeTab === 'payment' && <PaymentSettings />}
        {activeTab === 'notifications' && <NotificationSettings />}
      </div>
    </div>
  );
};
```

## Database Functions

### Admin Dashboard Stats

```sql
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS TABLE (
  total_revenue DECIMAL,
  pending_orders INTEGER,
  active_customers INTEGER,
  delivered_today INTEGER
) AS $$
BEGIN
  RETURN QUERY SELECT
    COALESCE(SUM(amount), 0)::DECIMAL as total_revenue,
    COUNT(*) FILTER (WHERE status = 'pending')::INTEGER as pending_orders,
    COUNT(DISTINCT user_id)::INTEGER as active_customers,
    COUNT(*) FILTER (WHERE delivered_at::DATE = CURRENT_DATE)::INTEGER as delivered_today
  FROM orders;
END;
$$ LANGUAGE plpgsql;
```

---

Next: [State Management](./10-state-management.md)
