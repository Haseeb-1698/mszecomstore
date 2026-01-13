import { useState } from 'react';
import { useSupabaseAuth, SupabaseAuthProvider } from '../../contexts/SupabaseAuthContext';
import { ArrowRight } from 'lucide-react';
import { ErrorMessage } from '../ui/ErrorMessage';

function LoginFormContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useSupabaseAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-y-6">
        <div>
          <label htmlFor="email" className="sr-only">Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-xl border-cream-400 dark:border-charcoal-600 bg-white dark:bg-charcoal-700 px-4 py-3.5 text-charcoal-900 dark:text-white placeholder-charcoal-800/50 dark:placeholder-gray-400 focus:border-coral-500 focus:ring-coral-500 focus:outline-none transition-all"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" title="Password" className="sr-only">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full rounded-xl border-cream-400 dark:border-charcoal-600 bg-white dark:bg-charcoal-700 px-4 py-3.5 text-charcoal-900 dark:text-white placeholder-charcoal-800/50 dark:placeholder-gray-400 focus:border-coral-500 focus:ring-coral-500 focus:outline-none transition-all"
            placeholder="Enter your password"
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
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-coral-500 px-8 py-3.5 font-medium text-white shadow-soft-light-focus hover:bg-coral-600 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2 transition-all disabled:opacity-50"
        >
          <span>{loading ? 'Signing in...' : 'Continue with Email'}</span>
          {!loading && <ArrowRight className="w-5 h-5" />}
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-charcoal-800/80 dark:text-gray-300">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="font-medium text-coral-500 hover:text-coral-600 dark:hover:text-coral-400">
            Sign up
          </a>
        </p>
      </div>
    </form>
  );
}

export function LoginForm() {
  return (
    <SupabaseAuthProvider>
      <LoginFormContent />
    </SupabaseAuthProvider>
  );
}