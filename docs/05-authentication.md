# Authentication

This document explains how user authentication works in MSZ Ecom Store.

## Overview

Authentication is handled by **Supabase Auth**, which provides:
- Email/password authentication
- Session management with JWT tokens
- Secure token refresh
- Integration with PostgreSQL RLS (Row Level Security)

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Authentication Flow                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌──────────┐    ┌───────────────┐    ┌──────────────────┐            │
│   │  User    │───►│  Login Form   │───►│  Supabase Auth   │            │
│   │          │    │  (React)      │    │  signInWithPass  │            │
│   └──────────┘    └───────────────┘    └────────┬─────────┘            │
│                                                  │                       │
│                                                  ▼                       │
│                   ┌───────────────┐    ┌──────────────────┐            │
│                   │  Auth Context │◄───│  Session + JWT   │            │
│                   │  (Provider)   │    │  (Stored in      │            │
│                   └───────┬───────┘    │   localStorage)  │            │
│                           │            └──────────────────┘            │
│                           │                                             │
│                           ▼                                             │
│   ┌──────────────────────────────────────────────────────┐             │
│   │  Components can now:                                   │             │
│   │  - Check if user is logged in (user !== null)         │             │
│   │  - Access user.id for database queries                │             │
│   │  - Check isAdmin for admin routes                     │             │
│   └──────────────────────────────────────────────────────┘             │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/supabase.ts` | Supabase client configuration |
| `src/contexts/SupabaseAuthContext.tsx` | React context for auth state |
| `src/components/auth/LoginForm.tsx` | Login form component |
| `src/components/auth/SignupForm.tsx` | Signup form component |
| `src/components/auth/AuthButtons.tsx` | Login/logout buttons |
| `src/lib/api/users.ts` | User profile API functions |

## Supabase Client Setup

### Client-Side Client

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient<Database>(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,    // Auto-refresh expired tokens
      persistSession: true,      // Store session in localStorage
      detectSessionInUrl: true,  // Handle OAuth redirects
    },
  }
);
```

### Server-Side Client

```typescript
// For API routes/server-side code
export const createServerSupabaseClient = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,   // No auto-refresh on server
      persistSession: false,     // No localStorage on server
      detectSessionInUrl: false,
    },
  });
};
```

### Admin Client (Service Role)

```typescript
// For admin operations (bypasses RLS)
export const createAdminSupabaseClient = () => {
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
```

## Auth Context Provider

The `SupabaseAuthProvider` manages authentication state globally:

```tsx
// src/contexts/SupabaseAuthContext.tsx

interface AuthContextType {
  user: User | null;          // Current user object
  session: Session | null;    // Current session (with tokens)
  loading: boolean;           // Initial auth check in progress
  isReady: boolean;           // Auth state determined
  signIn: (email, password) => Promise<{ error }>;
  signUp: (email, password) => Promise<{ error }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;           // User has admin role
  authError: string | null;   // Any auth initialization error
}
```

### How It Works

1. **On Mount**: Checks for existing session via `supabase.auth.getSession()`
2. **Session Found**: Sets `user` and `session`, checks admin status
3. **No Session**: Sets `user` to `null`
4. **Auth Changes**: Listens via `supabase.auth.onAuthStateChange()` for login/logout events

```tsx
useEffect(() => {
  // 1. Get existing session
  const initAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    setUser(session?.user ?? null);
    
    if (session?.user?.id) {
      // 2. Check if user is admin (async, non-blocking)
      checkAdminStatus(session.user.id).then(setIsAdmin);
    }
    
    setIsReady(true);
  };
  
  initAuth();
  
  // 3. Listen for auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      // ... handle events
    }
  );
  
  return () => subscription.unsubscribe();
}, []);
```

## Login Implementation

### LoginForm Component

```tsx
// src/components/auth/LoginForm.tsx

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else if (data.user) {
      // Redirect on success
      window.location.href = '/dashboard';
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
      {error && <ErrorMessage message={error} />}
    </form>
  );
}
```

**Key Points:**
- Uses `supabase.auth.signInWithPassword()` directly
- Does NOT use the auth context (avoids hydration issues)
- Redirects via `window.location.href` (full page navigation)

## Signup Implementation

### SignupForm Component

```tsx
// src/components/auth/SignupForm.tsx

export function SignupForm() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name, // Stored in user metadata
        },
      },
    });

    if (error) {
      setError(error.message);
      return;
    }

    // 2. Profile is created via database trigger or API call
    // (depends on your setup)
    
    window.location.href = '/dashboard';
  };
}
```

## Role-Based Access Control

### Checking Admin Status

```typescript
// src/lib/api/users.ts

export async function isUserAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (error) return false;
  return data?.role === 'admin';
}
```

### Protecting Admin Routes

Admin pages check auth status in the React component:

```tsx
// src/components/admin/AdminPageWrapper.tsx

export const AdminPageWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAdmin, isReady } = useSupabaseAuth();

  // Still loading
  if (!isReady) {
    return <LoadingScreen />;
  }

  // Not logged in
  if (!user) {
    window.location.href = '/login?redirect=/admin';
    return null;
  }

  // Not admin
  if (!isAdmin) {
    return <AccessDenied />;
  }

  // Authorized
  return <>{children}</>;
};
```

## Auth-Dependent UI Components

### AuthButtons (Header)

Shows different buttons based on auth state:

```tsx
// src/components/auth/AuthButtons.tsx

export default function AuthButtons() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session directly (standalone component)
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => setUser(session?.user ?? null)
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <Skeleton />;

  if (user) {
    return (
      <>
        <a href="/dashboard">Dashboard</a>
        <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
      </>
    );
  }

  return (
    <>
      <a href="/login">Login</a>
      <a href="/signup">Sign Up</a>
    </>
  );
}
```

**Note:** This component manages its own auth state because it renders outside the main provider tree (in the Astro header).

## Session Management

### How Sessions Work

1. On login, Supabase returns a **JWT access token** and **refresh token**
2. Tokens are stored in `localStorage` under `supabase.auth.token`
3. Access token is sent with every API request
4. When access token expires, refresh token is used to get a new one

### Token Configuration

Tokens have configurable expiration (in Supabase Dashboard):
- Access token: 1 hour (default)
- Refresh token: 7 days (default)

### Manual Session Refresh

```typescript
// Force refresh session
const { data, error } = await supabase.auth.refreshSession();
```

## Protecting Pages

### Pattern 1: Client-Side Check (React Components)

```tsx
function ProtectedPage() {
  const { user, isReady } = useSupabaseAuth();

  if (!isReady) return <Loading />;
  if (!user) {
    window.location.href = '/login';
    return null;
  }

  return <ProtectedContent />;
}
```

### Pattern 2: Redirect in Login Form

```tsx
// LoginForm reads redirect param
const urlParams = new URLSearchParams(window.location.search);
const redirect = urlParams.get('redirect') || '/dashboard';

// After successful login
window.location.href = redirect;
```

### Pattern 3: Astro Middleware (If SSR)

```typescript
// src/middleware.ts (not implemented, but possible)
export async function onRequest({ request, redirect }) {
  const session = await getSession(request);
  
  if (request.url.includes('/admin') && !session?.user) {
    return redirect('/login');
  }
}
```

## Sign Out

```typescript
const handleSignOut = async () => {
  await supabase.auth.signOut();
  window.location.href = '/'; // Redirect to home
};
```

This:
1. Clears tokens from localStorage
2. Invalidates session on server
3. Triggers `onAuthStateChange` with `SIGNED_OUT` event

## User Profile Management

### Getting User Profile

```typescript
// src/lib/api/users.ts

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return null;
  return data;
}
```

### Creating User Profile

```typescript
export async function createUserProfile(userId: string, data: ProfileData) {
  const { data: profile, error } = await supabase
    .from('user_profiles')
    .insert({ id: userId, ...data })
    .select()
    .single();

  return { profile, error };
}
```

### Updating User Profile

```typescript
export async function updateUserProfile(userId: string, updates: Partial<ProfileData>) {
  const { error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId);

  return { error };
}
```

## Common Patterns

### Redirect After Login

```tsx
// In any component that needs login
if (!user) {
  window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
}
```

### Protected API Calls

```typescript
// Get current user before API call
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  throw new Error('Not authenticated');
}

// Now make authenticated request
const { data } = await supabase
  .from('orders')
  .select('*')
  .eq('user_id', user.id);
```

### Admin-Only Operations

```typescript
// Check admin status before operation
const isAdmin = await isUserAdmin(user.id);

if (!isAdmin) {
  throw new Error('Admin access required');
}

// Proceed with admin operation
await supabase.from('services').insert(newService);
```

## Troubleshooting

### "Session not found" after page refresh

Ensure `persistSession: true` in Supabase client config.

### "Invalid refresh token"

User's session expired completely. Redirect to login.

### Auth state flickers

Use `client:only="react"` for auth-dependent components to avoid SSR mismatch.

### Admin check always returns false

Ensure `user_profiles` row exists with correct `role` value.

---

Next: [Components Guide](./06-components.md)
