import React, { useState } from 'react';

const OrderFilters: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  return (
    <div className="bg-cream-50 dark:bg-charcoal-800 rounded-2xl p-6 border border-cream-400 dark:border-charcoal-700 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label htmlFor="search-input" className="block text-sm font-medium text-charcoal-700 dark:text-cream-300 mb-2">
            Search Orders
          </label>
          <div className="relative">
            <input
              id="search-input"
              type="text"
              placeholder="Order ID or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500 text-charcoal-800 dark:text-cream-100"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-600 dark:text-cream-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status-select" className="block text-sm font-medium text-charcoal-700 dark:text-cream-300 mb-2">
            Status
          </label>
          <select
            id="status-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500 text-charcoal-800 dark:text-cream-100"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label htmlFor="date-select" className="block text-sm font-medium text-charcoal-700 dark:text-cream-300 mb-2">
            Date Range
          </label>
          <select
            id="date-select"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full px-4 py-2 bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500 text-charcoal-800 dark:text-cream-100"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {(searchTerm || statusFilter !== 'all' || dateRange !== 'all') && (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-charcoal-600 dark:text-cream-400">Active filters:</span>
          {searchTerm && (
            <span className="px-3 py-1 bg-coral-100 dark:bg-coral-900/30 text-coral-700 dark:text-coral-400 rounded-full text-sm flex items-center gap-2">
              Search: {searchTerm}
              <button onClick={() => setSearchTerm('')} className="hover:text-coral-900 dark:hover:text-coral-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {statusFilter !== 'all' && (
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm flex items-center gap-2">
              Status: {statusFilter}
              <button onClick={() => setStatusFilter('all')} className="hover:text-purple-900 dark:hover:text-purple-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {dateRange !== 'all' && (
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm flex items-center gap-2">
              Date: {dateRange}
              <button onClick={() => setDateRange('all')} className="hover:text-green-900 dark:hover:text-green-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setDateRange('all');
            }}
            className="text-sm text-coral-600 hover:text-coral-700 dark:text-coral-400 dark:hover:text-coral-300 font-medium"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderFilters;
