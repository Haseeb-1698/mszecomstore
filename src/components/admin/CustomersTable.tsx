import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { withTimeout, DEFAULT_QUERY_TIMEOUT } from '../../lib/utils/timeout';

interface Customer {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string | null;
  updated_at: string | null;
}

const CustomersTable: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    fetchCustomers();
    
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: queryError } = await withTimeout(
        supabase
          .from('user_profiles')
          .select('*')
          .eq('role', 'customer')
          .order('created_at', { ascending: false }),
        DEFAULT_QUERY_TIMEOUT,
        'Customers fetch timed out'
      );

      if (!mountedRef.current) return;

      if (queryError) {
        setError(queryError.message);
        return;
      }
      
      setCustomers(data || []);
    } catch (err: unknown) {
      console.error('Error fetching customers:', err);
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to load customers');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm) ||
    customer.whatsapp?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="bg-cream-50 dark:bg-charcoal-800 rounded-2xl p-6 border border-cream-400 dark:border-charcoal-700">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-cream-200 dark:bg-charcoal-700 rounded w-1/4"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-cream-200 dark:bg-charcoal-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-cream-50 dark:bg-charcoal-800 rounded-2xl p-6 border border-cream-400 dark:border-charcoal-700">
        <div className="text-center py-8">
          <svg className="w-12 h-12 mx-auto text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-charcoal-600 dark:text-cream-400 mb-4">{error}</p>
          <button
            onClick={fetchCustomers}
            className="px-4 py-2 bg-coral-500 hover:bg-coral-600 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream-50 dark:bg-charcoal-800 rounded-2xl border border-cream-400 dark:border-charcoal-700 overflow-hidden">
      {/* Search */}
      <div className="p-6 border-b border-cream-400 dark:border-charcoal-700">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500 text-charcoal-800 dark:text-cream-100"
            />
          </div>
          <div className="text-sm text-charcoal-600 dark:text-cream-400">
            {filteredCustomers.length} customer{filteredCustomers.length === 1 ? '' : 's'}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-cream-100 dark:bg-charcoal-900">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-charcoal-700 dark:text-cream-300">Name</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-charcoal-700 dark:text-cream-300">Email</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-charcoal-700 dark:text-cream-300">Phone</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-charcoal-700 dark:text-cream-300">WhatsApp</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-charcoal-700 dark:text-cream-300">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-t border-cream-400 dark:border-charcoal-700 hover:bg-cream-100 dark:hover:bg-charcoal-700 transition-colors">
                  <td className="py-4 px-6 text-sm font-medium text-charcoal-800 dark:text-cream-100">
                    {customer.full_name || 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-sm text-charcoal-700 dark:text-cream-300">
                    {customer.email || 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-sm text-charcoal-700 dark:text-cream-300">
                    {customer.phone || 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-sm text-charcoal-700 dark:text-cream-300">
                    {customer.whatsapp || 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-sm text-charcoal-700 dark:text-cream-300">
                    {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 px-6 text-center text-charcoal-600 dark:text-cream-400">
                  {searchTerm ? 'No customers found matching your search.' : 'No customers found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersTable;