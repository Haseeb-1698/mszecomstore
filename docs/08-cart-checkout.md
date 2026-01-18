# Cart & Checkout

This document explains the shopping cart and checkout implementation in detail.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Cart Architecture                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐  │
│   │  Service Page   │     │   Cart Page     │     │  Checkout Page  │  │
│   │                 │     │                 │     │                 │  │
│   │ AddToCartButton │     │ CartPage (via   │     │ CheckoutPage    │  │
│   │ (Standalone)    │     │ CartContext)    │     │ (via Context)   │  │
│   └────────┬────────┘     └────────┬────────┘     └────────┬────────┘  │
│            │                       │                       │           │
│            │                       │                       │           │
│            ▼                       ▼                       ▼           │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │                      BroadcastChannel                            │  │
│   │                    (Cross-tab sync)                              │  │
│   └─────────────────────────────────────────────────────────────────┘  │
│            │                       │                       │           │
│            ▼                       ▼                       ▼           │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │                       Cart API Layer                             │  │
│   │               (src/lib/api/cart.ts)                              │  │
│   └─────────────────────────────────────────────────────────────────┘  │
│            │                       │                       │           │
│            ▼                       ▼                       ▼           │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │                    Supabase Database                             │  │
│   │                  carts + cart_items tables                       │  │
│   └─────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Why Database-Stored Carts?

Carts are stored in the database (not localStorage) because:

1. **Cross-Device Access** - Cart is available on any device
2. **Authentication Integration** - Cart is tied to user account
3. **Admin Visibility** - Admins could see pending carts (abandoned cart recovery)
4. **Data Persistence** - Survives browser data clearing
5. **Server-Side Access** - Could process carts server-side if needed

## Database Schema Recap

```sql
-- One cart per user
CREATE TABLE carts (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES auth.users(id),
  discount DECIMAL DEFAULT 0,
  discount_code TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

-- Items in cart
CREATE TABLE cart_items (
  id UUID PRIMARY KEY,
  cart_id UUID REFERENCES carts(id),
  plan_id UUID REFERENCES plans(id),
  service_name TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  price DECIMAL NOT NULL,
  quantity INTEGER DEFAULT 1,
  UNIQUE(cart_id, plan_id)  -- Prevent duplicates
);
```

## Cart API Layer

### File: `src/lib/api/cart.ts`

#### Key Types

```typescript
export interface CartWithItems extends DbCart {
  cart_items: DbCartItem[];
}

export interface CartData {
  id: string;
  userId: string;
  items: {
    id: string;
    planId: string;
    serviceName: string;
    planName: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  discount: number;
  total: number;
  itemCount: number;
}
```

#### Core Functions

##### `getOrCreateCart(userId)`

Gets existing cart or creates new one.

```typescript
export async function getOrCreateCart(userId: string): Promise<CartWithItems | null> {
  // 1. Try to fetch existing cart
  const { data: existingCart } = await supabase
    .from('carts')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (existingCart) {
    // 2. Fetch cart items
    const { data: cartItems } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', existingCart.id);

    return { ...existingCart, cart_items: cartItems ?? [] };
  }

  // 3. Create new cart
  const { data: newCart } = await supabase
    .from('carts')
    .insert({ user_id: userId })
    .select()
    .single();

  return { ...newCart, cart_items: [] };
}
```

##### `addItemToCart(userId, item)`

Adds item or updates quantity if exists.

```typescript
export async function addItemToCart(
  userId: string,
  item: { planId: string; serviceName: string; planName: string; price: number }
): Promise<CartWithItems | null> {
  // 1. Get or create cart
  const cart = await getOrCreateCart(userId);
  if (!cart) return null;

  // 2. Check if item already exists
  const existingItem = cart.cart_items.find(i => i.plan_id === item.planId);

  if (existingItem) {
    // 3a. Update quantity
    await supabase
      .from('cart_items')
      .update({ quantity: existingItem.quantity + 1 })
      .eq('id', existingItem.id);
  } else {
    // 3b. Insert new item
    await supabase
      .from('cart_items')
      .insert({
        cart_id: cart.id,
        plan_id: item.planId,
        service_name: item.serviceName,
        plan_name: item.planName,
        price: item.price,
        quantity: 1
      });
  }

  // 4. Return updated cart
  return getOrCreateCart(userId);
}
```

##### `removeItemFromCart(userId, itemId)`

Removes item from cart.

```typescript
export async function removeItemFromCart(
  userId: string,
  itemId: string
): Promise<CartWithItems | null> {
  await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId);

  return getOrCreateCart(userId);
}
```

##### `updateItemQuantity(userId, itemId, quantity)`

Updates item quantity (removes if quantity = 0).

```typescript
export async function updateItemQuantity(
  userId: string,
  itemId: string,
  quantity: number
): Promise<CartWithItems | null> {
  if (quantity <= 0) {
    return removeItemFromCart(userId, itemId);
  }

  await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId);

  return getOrCreateCart(userId);
}
```

##### `clearCart(userId)`

Removes all items from cart.

```typescript
export async function clearCart(userId: string): Promise<void> {
  const cart = await getCart(userId);
  if (cart) {
    await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id);
  }
}
```

##### `toCartData(cart)`

Transforms database cart to UI-friendly format.

```typescript
export function toCartData(cart: CartWithItems): CartData {
  const items = cart.cart_items.map(item => ({
    id: item.id,
    planId: item.plan_id,
    serviceName: item.service_name,
    planName: item.plan_name,
    price: Number(item.price),
    quantity: item.quantity
  }));

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = Number(cart.discount) || 0;
  const total = Math.max(0, subtotal - discount);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: cart.id,
    userId: cart.user_id,
    items,
    subtotal,
    discount,
    total,
    itemCount
  };
}
```

## useCart Hook

### File: `src/hooks/useCart.ts`

The hook manages cart state and operations.

```typescript
export interface UseCartReturn {
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

### Key Implementation Details

#### Auth Integration

```typescript
export const useCart = (): UseCartReturn => {
  const { user, isReady: authReady } = useSupabaseAuth();

  // Wait for auth before loading cart
  useEffect(() => {
    if (!authReady) return;
    
    if (user) {
      loadCart(user.id);
    } else {
      setCart(null);
      setIsLoading(false);
    }
  }, [user, authReady]);
};
```

#### Cross-Tab Synchronization

```typescript
// Initialize BroadcastChannel
useEffect(() => {
  const channel = new BroadcastChannel('cart-sync');
  
  channel.onmessage = (event) => {
    if (event.data.type === 'cart-updated' && user) {
      refreshCart();
    }
  };

  return () => channel.close();
}, [user]);

// Broadcast updates
const broadcastCartUpdate = () => {
  channel.postMessage({ type: 'cart-updated' });
};
```

## Cart Context

### File: `src/contexts/CartContext.tsx`

Provides cart state to entire app tree.

```tsx
const CartContext = createContext<UseCartReturn>(defaultCartValue);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const cartValue = useCart();

  return (
    <CartContext.Provider value={cartValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
```

### Usage Pattern

```tsx
// Inside provider tree
function CartPage() {
  const { cart, removeItem, updateQuantity, isLoading } = useCartContext();
  
  if (isLoading) return <Loading />;
  
  return (
    <div>
      {cart.items.map(item => (
        <CartItem 
          key={item.id}
          item={item}
          onRemove={() => removeItem(item.id)}
        />
      ))}
    </div>
  );
}
```

## Adding Items to Cart

### From Service Detail Page

The `AddToCartButton` component works standalone (outside providers):

```tsx
// AddToCartButton.tsx
const handleAddToCart = async () => {
  if (!user) {
    // Redirect to login
    window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
    return;
  }

  setIsAdding(true);

  try {
    // Call API directly
    const updatedCart = await addItemToCart(user.id, {
      planId: plan.id,
      serviceName,
      planName: `${plan.duration_months} Month(s)`,
      price: plan.price
    });

    // Update localStorage for CartIcon
    const itemCount = updatedCart?.cart_items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    localStorage.setItem('cart-count', itemCount.toString());

    // Broadcast to other tabs/components
    broadcastChannel.postMessage({ type: 'cart-updated' });

    setIsAdded(true);
    onAddToCart?.();
  } catch (error) {
    console.error('Failed to add to cart:', error);
  } finally {
    setIsAdding(false);
  }
};
```

## Cart Page

### Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Cart Page Flow                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌──────────────┐                                                      │
│   │  Loading?    │──Yes──► Show loading spinner                          │
│   └──────┬───────┘                                                      │
│          │No                                                             │
│          ▼                                                               │
│   ┌──────────────┐                                                      │
│   │ Authenticated?│──No──► Show login prompt                             │
│   └──────┬───────┘                                                      │
│          │Yes                                                            │
│          ▼                                                               │
│   ┌──────────────┐                                                      │
│   │ Cart Empty?  │──Yes──► Show empty cart message                       │
│   └──────┬───────┘                                                      │
│          │No                                                             │
│          ▼                                                               │
│   ┌──────────────────────────────────────────────────────────────┐      │
│   │  Show Cart Items + Summary                                    │      │
│   │                                                               │      │
│   │  ┌────────────────┐  ┌────────────────┐                      │      │
│   │  │   CartItem     │  │   CartSummary  │                      │      │
│   │  │   (× N)        │  │                │                      │      │
│   │  │                │  │  Subtotal      │                      │      │
│   │  │  - Qty control │  │  Discount code │                      │      │
│   │  │  - Remove btn  │  │  Total         │                      │      │
│   │  │                │  │  Checkout btn  │                      │      │
│   │  └────────────────┘  └────────────────┘                      │      │
│   └──────────────────────────────────────────────────────────────┘      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### CartItem Component

```tsx
const CartItem: React.FC<CartItemProps> = ({ item, onRemove, onQuantityChange }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
      <div className="flex-1">
        <h3 className="font-medium">{item.serviceName}</h3>
        <p className="text-sm text-gray-500">{item.planName}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <button onClick={() => onQuantityChange(item.quantity - 1)}>-</button>
        <span>{item.quantity}</span>
        <button onClick={() => onQuantityChange(item.quantity + 1)}>+</button>
      </div>
      
      <div className="text-right">
        <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
      </div>
      
      <button onClick={onRemove}>
        <Trash2 className="w-5 h-5 text-red-500" />
      </button>
    </div>
  );
};
```

### CartSummary Component

```tsx
const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  discount,
  total,
  onApplyDiscount
}) => {
  const [discountCode, setDiscountCode] = useState('');

  const handleApplyDiscount = async () => {
    const success = await onApplyDiscount(discountCode);
    if (!success) {
      alert('Invalid discount code');
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        
        <div className="flex justify-between font-semibold text-lg pt-2 border-t">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
      
      <div className="mt-4">
        <input
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          placeholder="Discount code"
          className="w-full p-2 border rounded"
        />
        <button onClick={handleApplyDiscount} className="mt-2 w-full btn-secondary">
          Apply
        </button>
      </div>
      
      <a href="/checkout" className="mt-4 block">
        <button className="w-full btn-primary">
          Proceed to Checkout
        </button>
      </a>
    </div>
  );
};
```

## Checkout Flow

### File: `src/components/checkout/CheckoutPage.tsx`

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Checkout Flow                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌───────────────────────────────────────────────────────────────┐     │
│   │                     Checkout Page                              │     │
│   │                                                                │     │
│   │  ┌─────────────────────┐  ┌─────────────────────┐             │     │
│   │  │   CheckoutForm      │  │   OrderReview       │             │     │
│   │  │                     │  │                     │             │     │
│   │  │  - Full Name        │  │  - Item list        │             │     │
│   │  │  - Email            │  │  - Quantities       │             │     │
│   │  │  - WhatsApp         │  │  - Prices           │             │     │
│   │  │  - Instructions     │  │  - Total            │             │     │
│   │  │                     │  │                     │             │     │
│   │  └─────────────────────┘  └─────────────────────┘             │     │
│   │                                                                │     │
│   │  ┌─────────────────────────────────────────────────────────┐  │     │
│   │  │  [ ] I agree to the Terms and Conditions               │  │     │
│   │  │                                                         │  │     │
│   │  │  [         Place Order         ]                        │  │     │
│   │  └─────────────────────────────────────────────────────────┘  │     │
│   └───────────────────────────────────────────────────────────────┘     │
│                                                                          │
│                                    │                                     │
│                                    ▼                                     │
│   ┌───────────────────────────────────────────────────────────────┐     │
│   │  1. Validate customer info                                     │     │
│   │  2. Create order in database                                   │     │
│   │  3. Create order_items records                                 │     │
│   │  4. Clear cart                                                 │     │
│   │  5. Redirect to order confirmation                             │     │
│   └───────────────────────────────────────────────────────────────┘     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Order Submission Code

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // 1. Validate
  if (!validateCustomerInfo() || !agreeToTerms) {
    return;
  }

  setIsSubmitting(true);

  try {
    // 2. Get user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = '/login?redirect=/checkout';
      return;
    }

    // 3. Create order
    const orderInsert: DbOrderInsert = {
      user_id: user.id,
      plan_id: items[0].planId,  // Primary plan
      amount: cart.total,
      customer_name: customerInfo.name,
      customer_email: customerInfo.email,
      customer_whatsapp: customerInfo.whatsapp,
      special_instructions: customerInfo.instructions || null,
      status: 'pending'
    };

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderInsert)
      .select()
      .single();

    if (orderError) throw orderError;

    // 4. Create order items
    const orderItems: DbOrderItemInsert[] = items.map(item => ({
      order_id: order.id,
      plan_id: item.planId,
      service_name: item.serviceName,
      plan_name: item.planName,
      duration_months: 1,
      price: item.price,
      quantity: item.quantity
    }));

    await supabase.from('order_items').insert(orderItems);

    // 5. Clear cart
    await clearCart();

    // 6. Redirect to confirmation
    window.location.href = `/order/${order.id}?success=true`;

  } catch (error) {
    console.error('Checkout error:', error);
    alert('Failed to place order. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};
```

## CartIcon Component

Displays in header, shows item count badge.

```tsx
// src/components/ui/CartIcon.tsx
export default function CartIcon() {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    // Initial count from localStorage
    const stored = localStorage.getItem('cart-count');
    if (stored) setItemCount(parseInt(stored, 10));

    // Listen for cart updates
    const channel = new BroadcastChannel('cart-sync');
    channel.onmessage = () => {
      const count = localStorage.getItem('cart-count');
      setItemCount(count ? parseInt(count, 10) : 0);
    };

    return () => channel.close();
  }, []);

  return (
    <a href="/cart" className="relative">
      <ShoppingCart className="w-6 h-6" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-coral-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </a>
  );
}
```

## Error Handling

### API Timeouts

```typescript
// Timeout configuration
const TIMEOUT_CONFIG = {
  FETCH: 8000,   // 8 seconds
  CREATE: 10000, // 10 seconds
  UPDATE: 8000,  // 8 seconds
};

// Wrapper function
function withTimeout<T>(promise: Promise<T>, ms: number, operation: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error(`${operation} timed out`)), ms)
    )
  ]);
}
```

### Error States in UI

```tsx
if (error) {
  return (
    <div className="text-red-500">
      <p>Failed to load cart: {error}</p>
      <button onClick={refreshCart}>Retry</button>
    </div>
  );
}
```

---

Next: [Admin Panel](./09-admin-panel.md)
