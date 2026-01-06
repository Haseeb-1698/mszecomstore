// Cart management utilities for MSZ Ecom Store
import type { Cart, CartItem } from './types';
import { services } from '../data/services';

// Generate unique cart ID
export const generateCartId = (): string => {
  return `cart_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};

// Generate unique cart item ID
export const generateCartItemId = (): string => {
  return `item_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};

// Create empty cart
export const createEmptyCart = (customerId?: string): Cart => {
  const now = new Date();
  return {
    id: generateCartId(),
    customerId,
    items: [],
    subtotal: 0,
    discount: 0,
    total: 0,
    createdAt: now,
    updatedAt: now
  };
};

// Calculate cart totals
export const calculateCartTotals = (items: CartItem[]): { subtotal: number; total: number } => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return {
    subtotal,
    total: subtotal
  };
};

// Helper to parse price string to number
const parsePrice = (priceStr: string): number => {
  const match = priceStr.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
};

// Add item to cart
export const addItemToCart = (cart: Cart, serviceSlug: string, tierIndex: number = 0): Cart => {
  const service = services.find(s => s.slug === serviceSlug);
  if (!service) {
    throw new Error(`Service with slug ${serviceSlug} not found`);
  }

  const tier = service.pricingTiers?.[tierIndex];
  if (!tier) {
    throw new Error(`Tier index ${tierIndex} not found for service ${serviceSlug}`);
  }

  const price = parsePrice(tier.price);
  const planId = `${serviceSlug}-tier-${tierIndex}`;

  // Check if item already exists in cart
  const existingItemIndex = cart.items.findIndex(
    item => item.serviceId === serviceSlug && item.planId === planId
  );

  let updatedItems: CartItem[];

  if (existingItemIndex >= 0) {
    // Update quantity of existing item
    updatedItems = cart.items.map((item, index) => 
      index === existingItemIndex 
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    // Add new item
    const newItem: CartItem = {
      id: generateCartItemId(),
      serviceId: serviceSlug,
      planId,
      serviceName: service.name,
      planDuration: tier.name,
      price,
      quantity: 1
    };
    updatedItems = [...cart.items, newItem];
  }

  const { subtotal, total } = calculateCartTotals(updatedItems);

  return {
    ...cart,
    items: updatedItems,
    subtotal,
    total: total - cart.discount,
    updatedAt: new Date()
  };
};

// Remove item from cart
export const removeItemFromCart = (cart: Cart, itemId: string): Cart => {
  const updatedItems = cart.items.filter(item => item.id !== itemId);
  const { subtotal, total } = calculateCartTotals(updatedItems);

  return {
    ...cart,
    items: updatedItems,
    subtotal,
    total: total - cart.discount,
    updatedAt: new Date()
  };
};

// Update item quantity in cart
export const updateItemQuantity = (cart: Cart, itemId: string, quantity: number): Cart => {
  if (quantity <= 0) {
    return removeItemFromCart(cart, itemId);
  }

  const updatedItems = cart.items.map(item => 
    item.id === itemId 
      ? { ...item, quantity }
      : item
  );

  const { subtotal, total } = calculateCartTotals(updatedItems);

  return {
    ...cart,
    items: updatedItems,
    subtotal,
    total: total - cart.discount,
    updatedAt: new Date()
  };
};

// Apply discount to cart
export const applyDiscountToCart = (cart: Cart, discountAmount: number): Cart => {
  const discount = Math.max(0, Math.min(discountAmount, cart.subtotal));
  const total = cart.subtotal - discount;

  return {
    ...cart,
    discount,
    total,
    updatedAt: new Date()
  };
};

// Apply discount code to cart
export const applyDiscountCode = (cart: Cart, discountCode: string): Cart => {
  const discountCodes: Record<string, number> = {
    'SAVE10': cart.subtotal * 0.1,
    'SAVE20': cart.subtotal * 0.2,
    'FIRST100': 100,
    'STUDENT50': 50,
    'WELCOME15': cart.subtotal * 0.15
  };

  const discountAmount = discountCodes[discountCode.toUpperCase()] || 0;
  return applyDiscountToCart(cart, discountAmount);
};

// Clear cart
export const clearCart = (cart: Cart): Cart => {
  return {
    ...cart,
    items: [],
    subtotal: 0,
    discount: 0,
    total: 0,
    updatedAt: new Date()
  };
};

// Get cart item count
export const getCartItemCount = (cart: Cart): number => {
  return cart.items.reduce((count, item) => count + item.quantity, 0);
};

// Check if cart is empty
export const isCartEmpty = (cart: Cart): boolean => {
  return cart.items.length === 0;
};

// Local Storage Keys
export const CART_STORAGE_KEY = 'msz_ecom_cart';

// Save cart to local storage
export const saveCartToStorage = (cart: Cart): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

// Load cart from local storage
export const loadCartFromStorage = (): Cart | null => {
  if (typeof window === 'undefined') return null;
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    if (!cartData) return null;

    const cart = JSON.parse(cartData);
    
    // Convert date strings back to Date objects
    return {
      ...cart,
      createdAt: new Date(cart.createdAt),
      updatedAt: new Date(cart.updatedAt)
    };
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    return null;
  }
};

// Remove cart from local storage
export const removeCartFromStorage = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to remove cart from localStorage:', error);
  }
};

// Validate cart items against current service data
export const validateCartItems = (cart: Cart): Cart => {
  const validItems = cart.items.filter(item => {
    const service = services.find(s => s.slug === item.serviceId);
    return !!service;
  });

  const { subtotal } = calculateCartTotals(validItems);

  return {
    ...cart,
    items: validItems,
    subtotal,
    total: subtotal - cart.discount,
    updatedAt: new Date()
  };
};

// Cart utility functions for React components
export const cartUtils = {
  create: createEmptyCart,
  addItem: addItemToCart,
  removeItem: removeItemFromCart,
  updateQuantity: updateItemQuantity,
  applyDiscount: applyDiscountToCart,
  applyDiscountCode,
  clear: clearCart,
  getItemCount: getCartItemCount,
  isEmpty: isCartEmpty,
  save: saveCartToStorage,
  load: loadCartFromStorage,
  remove: removeCartFromStorage,
  validate: validateCartItems
};
