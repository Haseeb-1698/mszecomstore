// Cart API - Database operations for cart management
import { supabase } from '../supabase';
import type { DbCart, DbCartItem, DbCartItemInsert } from '../database.types';

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
}

// Helper to add timeout to promises
function withTimeout<T>(promiseOrThenable: PromiseLike<T>, timeoutMs: number, operation: string): Promise<T> {
  const promise = Promise.resolve(promiseOrThenable);
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error(`${operation} timed out after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
}

// Get or create cart for user
export async function getOrCreateCart(userId: string): Promise<CartWithItems | null> {
  try {
    // First try to get existing cart (without nested items for now)
    // Use longer timeout for first query (cold start can take 5-10s on Supabase free tier)
    const { data: existingCart, error: fetchError } = await withTimeout(
      supabase
        .from('carts')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle(),
      15, // 15 seconds to account for Supabase cold start
      'Fetch cart'
    );

    if (fetchError) {
      return null;
    }

    // If cart exists, fetch its items
    if (existingCart) {
      const { data: cartItems, error: itemsError } = await withTimeout(
        supabase
          .from('cart_items')
          .select('*')
          .eq('cart_id', existingCart.id),
        20000, // 20 seconds for items
        'Fetch cart items'
      );

      if (itemsError) {
        // Return cart with empty items rather than failing completely
        return {
          ...existingCart,
          cart_items: []
        } as CartWithItems;
      }

      return {
        ...existingCart,
        cart_items: cartItems ?? []
      } as CartWithItems;
    }

    // No cart exists, create one
    const { data: newCart, error: createError } = await withTimeout(
      supabase
        .from('carts')
        .insert({ user_id: userId })
        .select('*')
        .single(),
      20000, // 20 seconds for insert
      'Create cart'
    );

    if (createError) {
      // Check if cart was created by another concurrent request
      if (createError.code === '23505') {
        return getOrCreateCart(userId);
      }
      return null;
    }

    if (!newCart) {
      return null;
    }
    return {
      ...newCart,
      cart_items: []
    } as CartWithItems;

  } catch (err) {
    return null;
  }
}

// Get cart by user ID
export async function getCart(userId: string): Promise<CartWithItems | null> {
  const { data, error } = await supabase
    .from('carts')
    .select(`
      *,
      cart_items (*)
    `)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    return null;
  }

  if (!data) {
    return null;
  }

  return data as CartWithItems;
}

// Add item to cart
export async function addItemToCart(
  userId: string,
  item: {
    planId: string;
    serviceName: string;
    planName: string;
    price: number;
    quantity?: number;
  }
): Promise<CartWithItems | null> {
  // Get or create cart
  const cart = await getOrCreateCart(userId);
  if (!cart) return null;

  // Check if item already exists
  const existingItem = cart.cart_items?.find(ci => ci.plan_id === item.planId);

  if (existingItem) {
    // Update quantity
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: existingItem.quantity + (item.quantity || 1) })
      .eq('id', existingItem.id);

    if (error) {
      return null;
    }
  } else {
    // Insert new item
    const newItem: DbCartItemInsert = {
      cart_id: cart.id,
      plan_id: item.planId,
      service_name: item.serviceName,
      plan_name: item.planName,
      price: item.price,
      quantity: item.quantity || 1
    };

    const { error } = await supabase
      .from('cart_items')
      .insert(newItem);

    if (error) {
      return null;
    }
  }

  // Return updated cart
  return getCart(userId);
}

// Remove item from cart
export async function removeItemFromCart(
  userId: string,
  itemId: string
): Promise<CartWithItems | null> {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId);

  if (error) {
    return null;
  }

  return getCart(userId);
}

// Update item quantity
export async function updateItemQuantity(
  userId: string,
  itemId: string,
  quantity: number
): Promise<CartWithItems | null> {
  if (quantity <= 0) {
    return removeItemFromCart(userId, itemId);
  }

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId);

  if (error) {
    return null;
  }

  return getCart(userId);
}

// Clear cart (remove all items)
export async function clearCart(userId: string): Promise<CartWithItems | null> {
  const cart = await getCart(userId);
  if (!cart) return null;

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('cart_id', cart.id);

  if (error) {
    return null;
  }

  // Also reset discount
  await supabase
    .from('carts')
    .update({ discount: 0, discount_code: null })
    .eq('id', cart.id);

  return getCart(userId);
}

// Apply discount code
export async function applyDiscountCode(
  userId: string,
  code: string,
  subtotal: number
): Promise<{ success: boolean; discount: number }> {
  const discountCodes: Record<string, number | ((subtotal: number) => number)> = {
    'SAVE10': (s) => s * 0.1,
    'SAVE20': (s) => s * 0.2,
    'FIRST100': 100,
    'STUDENT50': 50,
    'WELCOME15': (s) => s * 0.15
  };

  const discountFn = discountCodes[code.toUpperCase()];
  if (!discountFn) {
    return { success: false, discount: 0 };
  }

  const discountAmount = typeof discountFn === 'function' 
    ? discountFn(subtotal) 
    : discountFn;

  const cart = await getCart(userId);
  if (!cart) {
    return { success: false, discount: 0 };
  }

  const { error } = await supabase
    .from('carts')
    .update({ discount: discountAmount, discount_code: code.toUpperCase() })
    .eq('id', cart.id);

  if (error) {
    return { success: false, discount: 0 };
  }

  return { success: true, discount: discountAmount };
}

// Get cart item count
export async function getCartItemCount(userId: string): Promise<number> {
  const cart = await getCart(userId);
  if (!cart?.cart_items) return 0;
  
  return cart.cart_items.reduce((sum, item) => sum + item.quantity, 0);
}

// Convert DB cart to CartData format
export function toCartData(cart: CartWithItems): CartData {
  const items = (cart.cart_items || []).map(item => ({
    id: item.id,
    planId: item.plan_id,
    serviceName: item.service_name,
    planName: item.plan_name,
    price: item.price,
    quantity: item.quantity
  }));

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = Math.max(0, subtotal - (cart.discount || 0));

  return {
    id: cart.id,
    userId: cart.user_id,
    items,
    subtotal,
    discount: cart.discount || 0,
    total
  };
}
