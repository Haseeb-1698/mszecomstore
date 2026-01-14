import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { getCartItemCount } from '../../lib/api/cart';

const CartIcon: React.FC = () => {
  const [itemCount, setItemCount] = useState(0);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check authentication and load cart
    const initializeCart = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const count = await getCartItemCount(session.user.id);
        setItemCount(count);
      }
    };

    initializeCart();

    // Listen for auth changes (skip INITIAL_SESSION to avoid duplicates)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'INITIAL_SESSION') return;
      
      setUser(session?.user ?? null);
      if (session?.user) {
        const count = await getCartItemCount(session.user.id);
        setItemCount(count);
      } else {
        setItemCount(0);
      }
    });

    // Listen for cart updates from other components
    const handleCartUpdate = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const count = await getCartItemCount(session.user.id);
        setItemCount(count);
      }
    };

    globalThis.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      subscription.unsubscribe();
      globalThis.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Don't show cart icon if not logged in
  if (!user) {
    return null;
  }

  return (
    <a
      href="/cart"
      className="relative inline-flex items-center justify-center p-2 rounded-lg hover:bg-cream-200 dark:hover:bg-charcoal-800 transition-colors group"
      aria-label="Shopping Cart"
    >
      <svg
        className="w-6 h-6 text-charcoal-800 dark:text-cream-100 group-hover:text-coral-500 dark:group-hover:text-coral-400 transition-colors"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-coral-500 rounded-full shadow-soft">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </a>
  );
};

export default CartIcon;
