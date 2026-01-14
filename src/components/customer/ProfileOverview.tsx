import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  created_at: string;
}

const ProfileOverview: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Try to get additional profile data from user_profiles table
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        setProfile({
          id: user.id,
          email: user.email || '',
          full_name: profileData?.full_name || user.user_metadata?.full_name || 'User',
          phone: profileData?.phone || user.user_metadata?.phone,
          created_at: user.created_at,
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="bg-cream-100 dark:bg-charcoal-800 rounded-2xl border border-cream-300 dark:border-charcoal-700 p-6 animate-pulse">
        <div className="w-20 h-20 bg-cream-200 dark:bg-charcoal-700 rounded-full mx-auto mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-cream-200 dark:bg-charcoal-700 rounded w-3/4 mx-auto"></div>
          <div className="h-3 bg-cream-200 dark:bg-charcoal-700 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  const memberSince = profile?.created_at 
    ? new Date(profile.created_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      })
    : 'Unknown';

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-cream-100 dark:bg-charcoal-800 rounded-2xl border border-cream-300 dark:border-charcoal-700 overflow-hidden">
      <div className="p-6 border-b border-cream-300 dark:border-charcoal-700">
        <h2 className="text-xl font-bold text-charcoal-900 dark:text-cream-50">
          Profile Overview
        </h2>
      </div>

      <div className="p-6">
        {/* Profile Avatar */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-coral-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl font-bold text-white">
              {profile?.full_name ? getInitials(profile.full_name) : 'U'}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-charcoal-900 dark:text-cream-50 mb-1">
            {profile?.full_name || 'User'}
          </h3>
          <p className="text-sm text-charcoal-600 dark:text-cream-300">
            Member since {memberSince}
          </p>
        </div>

        {/* Profile Details */}
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-charcoal-500 dark:text-cream-400 mb-1">Email</p>
              <p className="text-sm font-medium text-charcoal-900 dark:text-cream-50 break-all">
                {profile?.email}
              </p>
            </div>
          </div>

          {profile?.phone && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-charcoal-500 dark:text-cream-400 mb-1">Phone</p>
                <p className="text-sm font-medium text-charcoal-900 dark:text-cream-50">
                  {profile.phone}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-charcoal-500 dark:text-cream-400 mb-1">Account ID</p>
              <p className="text-xs font-mono text-charcoal-900 dark:text-cream-50 break-all">
                {profile?.id.slice(0, 16)}...
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <a
            href="/profile/edit"
            className="block w-full text-center px-4 py-2 bg-cream-200 hover:bg-cream-300 dark:bg-charcoal-700 dark:hover:bg-charcoal-600 text-charcoal-900 dark:text-cream-50 rounded-lg font-medium transition-colors"
          >
            Edit Profile
          </a>
          <a
            href="/profile/security"
            className="block w-full text-center px-4 py-2 bg-cream-200 hover:bg-cream-300 dark:bg-charcoal-700 dark:hover:bg-charcoal-600 text-charcoal-900 dark:text-cream-50 rounded-lg font-medium transition-colors"
          >
            Security Settings
          </a>
          <button
            onClick={handleSignOut}
            className="block w-full text-center px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg font-medium transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Support Section */}
        <div className="mt-6 pt-6 border-t border-cream-300 dark:border-charcoal-700">
          <h4 className="text-sm font-semibold text-charcoal-900 dark:text-cream-50 mb-3">
            Need Help?
          </h4>
          <div className="space-y-2">
            <a
              href="/contact"
              className="flex items-center gap-2 text-sm text-charcoal-600 dark:text-cream-300 hover:text-coral-600 dark:hover:text-coral-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Contact Support
            </a>
            <a
              href="/how-it-works"
              className="flex items-center gap-2 text-sm text-charcoal-600 dark:text-cream-300 hover:text-coral-600 dark:hover:text-coral-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              How It Works
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
