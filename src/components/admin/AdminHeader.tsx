import React, { useState } from 'react';
import { useSupabaseAuth, SupabaseAuthProvider } from '../../contexts/SupabaseAuthContext';

const AdminHeaderContent: React.FC = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, signOut } = useSupabaseAuth(); // Use context for auth

  const handleLogout = async () => {
    await signOut();
    // Redirect or handle post-logout as needed
  };

  return (
    <header className="h-16 bg-cream-50 dark:bg-charcoal-800 border-b border-cream-400 dark:border-charcoal-700 flex items-center justify-between px-6">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <input
            type="search"
            placeholder="Search..."
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

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-cream-200 dark:hover:bg-charcoal-700 transition-colors">
          <svg className="w-6 h-6 text-charcoal-700 dark:text-cream-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-coral-500 rounded-full"></span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => {
            const theme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', theme);
          }}
          className="p-2 rounded-xl hover:bg-cream-200 dark:hover:bg-charcoal-700 transition-colors"
          aria-label="Toggle theme"
        >
          <svg className="w-6 h-6 text-charcoal-700 dark:text-cream-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 rounded-xl hover:bg-cream-200 dark:hover:bg-charcoal-700 transition-colors"
          >
            <div className="w-8 h-8 bg-coral-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <span className="text-sm font-medium text-charcoal-800 dark:text-cream-100">{user?.email || 'Admin'}</span>
            <svg className="w-4 h-4 text-charcoal-600 dark:text-cream-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-cream-50 dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-700 rounded-xl shadow-soft-lg py-2 z-50">
              <a
                href="/admin/settings"
                className="block px-4 py-2 text-sm text-charcoal-700 dark:text-cream-300 hover:bg-cream-200 dark:hover:bg-charcoal-700"
              >
                Profile Settings
              </a>
              <a
                href="/"
                className="block px-4 py-2 text-sm text-charcoal-700 dark:text-cream-300 hover:bg-cream-200 dark:hover:bg-charcoal-700"
              >
                View Site
              </a>
              <hr className="my-2 border-cream-400 dark:border-charcoal-700" />    
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-cream-200 dark:hover:bg-charcoal-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// Wrapped component with auth provider
const AdminHeader: React.FC = () => (
  <SupabaseAuthProvider>
    <AdminHeaderContent />
  </SupabaseAuthProvider>
);

export default AdminHeader;