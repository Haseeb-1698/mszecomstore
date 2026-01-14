import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ArrowRight } from 'lucide-react';
import { ErrorMessage } from '../ui/ErrorMessage';

interface SignupFormProps {
  role?: 'customer' | 'admin';
  redirectTo?: string;
}

/**
 * SignupForm - Self-contained signup form that doesn't rely on React context.
 * This avoids hydration issues with Astro's client:load directive.
 * 
 * @param role - The role to assign to the new user (default: 'customer')
 * @param redirectTo - Where to redirect after successful signup
 */
export function SignupForm({ role = 'customer', redirectTo }: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || email.split('@')[0],
            role: role, // Pass role in metadata for trigger to use
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-6">
        <div className="text-coral-500 text-2xl font-bold tracking-tighter">
          ✓ Account Created!
        </div>
        <p className="text-charcoal-800/80 dark:text-gray-300">
          {role === 'admin' 
            ? 'Your admin account has been created. Please check your email to verify your account.'
            : 'Please check your email to verify your account and start your journey with SubHub.'
          }
        </p>
        <button
          onClick={() => globalThis.location.href = redirectTo || '/login'}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-coral-500 px-8 py-3.5 font-medium text-white shadow-soft hover:bg-coral-600 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2 transition-all"
        >
          <span>Go to Login</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-y-6">
        <div>
          <label htmlFor="fullName" className="sr-only">Full Name</label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="block w-full rounded-xl border border-cream-400 dark:border-charcoal-600 bg-white dark:bg-charcoal-700 px-4 py-3.5 text-charcoal-900 dark:text-white placeholder-charcoal-800/50 dark:placeholder-gray-400 focus:border-coral-500 focus:ring-coral-500 focus:outline-none transition-all"
            placeholder="Full name (optional)"
          />
        </div>

        <div>
          <label htmlFor="email" className="sr-only">Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-xl border border-cream-400 dark:border-charcoal-600 bg-white dark:bg-charcoal-700 px-4 py-3.5 text-charcoal-900 dark:text-white placeholder-charcoal-800/50 dark:placeholder-gray-400 focus:border-coral-500 focus:ring-coral-500 focus:outline-none transition-all"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" title="Password" className="sr-only">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full rounded-xl border border-cream-400 dark:border-charcoal-600 bg-white dark:bg-charcoal-700 px-4 py-3.5 text-charcoal-900 dark:text-white placeholder-charcoal-800/50 dark:placeholder-gray-400 focus:border-coral-500 focus:ring-coral-500 focus:outline-none transition-all"
            placeholder="Create a password"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" title="Confirm Password" className="sr-only">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block w-full rounded-xl border border-cream-400 dark:border-charcoal-600 bg-white dark:bg-charcoal-700 px-4 py-3.5 text-charcoal-900 dark:text-white placeholder-charcoal-800/50 dark:placeholder-gray-400 focus:border-coral-500 focus:ring-coral-500 focus:outline-none transition-all"
            placeholder="Confirm your password"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4">
          <ErrorMessage message={error} />
        </div>
      )}

      <div className="mt-8">
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-coral-500 px-8 py-3.5 font-medium text-white shadow-soft hover:bg-coral-600 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2 transition-all disabled:opacity-50"
        >
          <span>{loading ? 'Creating Account...' : 'Continue with Email'}</span>
          {!loading && <ArrowRight className="w-5 h-5" />}
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-charcoal-800/80 dark:text-gray-300">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-coral-500 hover:text-coral-600 dark:hover:text-coral-400">
            Log in
          </a>
        </p>
      </div>
    </form>
  );
}