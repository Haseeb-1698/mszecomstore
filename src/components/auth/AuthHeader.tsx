import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { Button } from '../ui/Button';

export function AuthHeader() {
  const { user, signOut, loading } = useSupabaseAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <a href="/login">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </a>
        <a href="/signup">
          <Button size="sm">
            Sign Up
          </Button>
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <a href="/dashboard">
        <Button variant="outline" size="sm">
          Dashboard
        </Button>
      </a>
      <Button variant="outline" size="sm" onClick={() => signOut()}>
        Sign Out
      </Button>
    </div>
  );
}