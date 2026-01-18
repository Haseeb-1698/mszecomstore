# State Management

This document explains how state is managed throughout the application.

## State Categories

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         State Management Layers                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  Server State (TanStack Query)                                  │   │
│   │  - Data from Supabase                                           │   │
│   │  - Caching, refetching, invalidation                            │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  Auth State (SupabaseAuthContext)                               │   │
│   │  - User session                                                 │   │
│   │  - Admin status                                                 │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  Cart State (CartContext + useCart hook)                        │   │
│   │  - Cart items                                                   │   │
│   │  - Add/remove/update operations                                 │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  UI State (React useState/useReducer)                           │   │
│   │  - Form inputs                                                  │   │
│   │  - Modal open/close                                             │   │
│   │  - Loading indicators                                           │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  Persisted State (localStorage)                                 │   │
│   │  - Theme preference                                             │   │
│   │  - Cart count (for quick display)                               │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Provider Hierarchy

```tsx
// AppProviders.tsx - The provider tree
<ErrorBoundary>
  <QueryProvider>              {/* TanStack Query */}
    <SupabaseAuthProvider>     {/* Auth state */}
      <CartProvider>           {/* Cart state (optional) */}
        {children}
      </CartProvider>
    </SupabaseAuthProvider>
  </QueryProvider>
</ErrorBoundary>
```

**Order matters!** Cart depends on Auth, which depends on Query.

## SupabaseAuthContext

### Purpose

Provides authentication state to the entire app.

### State Shape

```typescript
interface AuthContextType {
  user: User | null;          // Supabase user object
  session: Session | null;    // Session with tokens
  loading: boolean;           // Initial check in progress
  isReady: boolean;           // Auth determined
  signIn: (email, password) => Promise<{ error }>;
  signUp: (email, password) => Promise<{ error }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;           // Has admin role
  authError: string | null;   // Initialization error
}
```

### Implementation Highlights

```tsx
// SupabaseAuthContext.tsx

export function SupabaseAuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 1. Get initial session
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // 2. Check admin status (non-blocking)
        if (session?.user?.id) {
          checkAdminStatus(session.user.id).then(setIsAdmin);
        }
      } finally {
        setLoading(false);
        setIsReady(true);
      }
    };

    initAuth();

    // 3. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          setIsAdmin(false);
        } else if (session?.user?.id) {
          const adminStatus = await checkAdminStatus(session.user.id);
          setIsAdmin(adminStatus);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isReady, signIn, signOut, isAdmin, ... }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Usage

```tsx
// In any component inside the provider
function MyComponent() {
  const { user, isAdmin, isReady, signOut } = useSupabaseAuth();

  if (!isReady) return <Loading />;

  if (!user) return <LoginPrompt />;

  return (
    <div>
      <p>Welcome, {user.email}</p>
      {isAdmin && <a href="/admin">Admin Panel</a>}
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

## CartContext

### Purpose

Manages shopping cart state with database persistence.

### State Shape

```typescript
interface UseCartReturn {
  cart: CartData | null;
  addItem: (item: ItemData) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  applyDiscountCode: (code: string) => Promise<boolean>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  itemCount: number;
  isEmpty: boolean;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}
```

### Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Cart State Flow                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   CartContext (Provider)                                                 │
│        │                                                                 │
│        ├── Wraps useCart hook                                            │
│        │                                                                 │
│        └── Provides state to descendants via useCartContext()            │
│                                                                          │
│   useCart hook (Implementation)                                          │
│        │                                                                 │
│        ├── Consumes useSupabaseAuth() for user ID                       │
│        │                                                                 │
│        ├── Loads cart from database on mount                            │
│        │                                                                 │
│        ├── Manages local state (cart, loading, error)                   │
│        │                                                                 │
│        ├── Provides mutation functions (add, remove, update)            │
│        │                                                                 │
│        └── Handles cross-tab sync via BroadcastChannel                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Cross-Tab Synchronization

```tsx
// In useCart hook
useEffect(() => {
  // Create channel for cross-tab communication
  const channel = new BroadcastChannel('cart-sync');

  // Listen for updates from other tabs
  channel.onmessage = (event) => {
    if (event.data.type === 'cart-updated' && user) {
      refreshCart();  // Reload cart from database
    }
  };

  return () => channel.close();
}, [user]);

// After any cart modification
const broadcastUpdate = () => {
  channel.postMessage({ type: 'cart-updated' });
};
```

### Why Context + Hook Pattern?

```tsx
// CartContext.tsx

// The hook contains the logic
const useCart = () => {
  // All the state and functions...
  return { cart, addItem, removeItem, ... };
};

// The context provides it to the tree
const CartContext = createContext(defaultValue);

export const CartProvider = ({ children }) => {
  const cartValue = useCart();  // Single instance
  return (
    <CartContext.Provider value={cartValue}>
      {children}
    </CartContext.Provider>
  );
};

// Consumer hook
export const useCartContext = () => useContext(CartContext);
```

This ensures:
1. **Single Instance** - One cart state for the entire app
2. **Shared State** - All components see the same cart
3. **Automatic Updates** - Changes propagate everywhere

## QueryProvider (TanStack Query)

### Purpose

Handles server state (data fetching, caching, synchronization).

### Setup

```tsx
// QueryProvider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,     // Data fresh for 5 minutes
      gcTime: 30 * 60 * 1000,       // Cache for 30 minutes
      refetchOnWindowFocus: false,   // Don't refetch on tab focus
      retry: 2,                      // Retry failed requests twice
    },
  },
});

export const QueryProvider = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);
```

### Usage Example

```tsx
// Using TanStack Query for data fetching
function ServicesPage() {
  const { data: services, isLoading, error } = useQuery({
    queryKey: ['services'],
    queryFn: getServices,
  });

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <div>
      {services.map(s => <ServiceCard key={s.id} service={s} />)}
    </div>
  );
}
```

## Local Component State

For UI-specific state that doesn't need to be shared:

```tsx
function OrderForm() {
  // Form input state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  });

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Computed values (no state needed)
  const isValid = formData.name && formData.email && formData.whatsapp;

  // ...
}
```

## Persisted State (localStorage)

### Theme Preference

```tsx
// ThemeSwitcher.tsx
const [theme, setTheme] = useState('light');

useEffect(() => {
  // Load from localStorage
  const saved = localStorage.getItem('theme');
  if (saved) {
    setTheme(saved);
    document.documentElement.classList.toggle('dark', saved === 'dark');
  }
}, []);

const toggleTheme = () => {
  const newTheme = theme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  localStorage.setItem('theme', newTheme);
  document.documentElement.classList.toggle('dark', newTheme === 'dark');
};
```

### Cart Count Cache

```tsx
// For quick display before full cart loads
const [itemCount, setItemCount] = useState(() => {
  const cached = localStorage.getItem('cart-count');
  return cached ? parseInt(cached, 10) : 0;
});

// Update cache when cart changes
useEffect(() => {
  if (cart) {
    localStorage.setItem('cart-count', cart.itemCount.toString());
  }
}, [cart]);
```

## State Update Patterns

### Optimistic Updates

Update UI immediately, revert if server fails:

```tsx
const removeItem = async (itemId: string) => {
  // 1. Save current state
  const previousCart = cart;
  
  // 2. Optimistically update UI
  setCart(prev => ({
    ...prev,
    items: prev.items.filter(i => i.id !== itemId)
  }));

  try {
    // 3. Make API call
    await apiRemoveItem(user.id, itemId);
  } catch (error) {
    // 4. Revert on failure
    setCart(previousCart);
    setError('Failed to remove item');
  }
};
```

### Async State Updates

```tsx
const addItem = async (item: ItemData) => {
  setIsLoading(true);
  setError(null);

  try {
    const updatedCart = await apiAddItem(user.id, item);
    setCart(toCartData(updatedCart));
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};
```

## Component Communication Patterns

### Through Context

```tsx
// Parent provides, children consume
<CartProvider>
  <Header />      {/* Can access cart via useCartContext() */}
  <CartPage />    {/* Can access cart via useCartContext() */}
</CartProvider>
```

### Through Props (Direct)

```tsx
// Parent passes down
function CartPage() {
  const { cart, removeItem } = useCartContext();

  return (
    <div>
      {cart.items.map(item => (
        <CartItem
          key={item.id}
          item={item}
          onRemove={() => removeItem(item.id)}  // Function passed as prop
        />
      ))}
    </div>
  );
}
```

### Through BroadcastChannel (Cross-Tab)

```tsx
// Tab A (AddToCartButton)
await addItemToCart(userId, item);
channel.postMessage({ type: 'cart-updated' });

// Tab B (CartIcon) - receives update
channel.onmessage = (event) => {
  if (event.data.type === 'cart-updated') {
    refreshCount();
  }
};
```

## Debugging State

### React DevTools

Install the React DevTools browser extension to:
- Inspect component props and state
- View context values
- Track re-renders

### Console Logging

The codebase includes strategic console.log statements:

```tsx
console.log('[useCart] Loading cart for user:', uid);
console.log('[useCart] Cart loaded:', { itemCount: cart.items.length });
console.log('[SupabaseAuth] Initialization complete, isReady set to true');
```

### TanStack Query DevTools

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  {children}
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

---

Next: [API Layer](./11-api-layer.md)
