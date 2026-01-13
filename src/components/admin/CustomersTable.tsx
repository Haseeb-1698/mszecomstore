import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Customer {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  role: string;
  created_at: string;
}

const CustomersTable: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('role', 'customer')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (err: any) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
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
            {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''}
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
                    {new Date(customer.created_at).toLocaleDateString()}
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