import React from 'react';
import type { CartItem as CartItemType } from '../../lib/types';
import { formatPrice } from '../../lib/utils';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemoveItem }) => {
  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrement = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  return (
    <div className="bg-cream-100 dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-700 rounded-2xl p-6 transition-all hover:shadow-soft">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Service Info */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-charcoal-800 dark:text-cream-100 mb-2">
            {item.serviceName}
          </h3>
          <p className="text-charcoal-600 dark:text-cream-400 mb-4">
            {item.planDuration}
          </p>

          {/* Quantity Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleDecrement}
                className="w-8 h-8 rounded-lg bg-cream-200 dark:bg-charcoal-700 hover:bg-cream-300 dark:hover:bg-charcoal-600 text-charcoal-800 dark:text-cream-100 flex items-center justify-center transition-colors"
                aria-label="Decrease quantity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>

              <span className="w-12 text-center text-charcoal-800 dark:text-cream-100 font-medium">
                {item.quantity}
              </span>

              <button
                onClick={handleIncrement}
                className="w-8 h-8 rounded-lg bg-cream-200 dark:bg-charcoal-700 hover:bg-cream-300 dark:hover:bg-charcoal-600 text-charcoal-800 dark:text-cream-100 flex items-center justify-center transition-colors"
                aria-label="Increase quantity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            <button
              onClick={() => onRemoveItem(item.id)}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium transition-colors"
            >
              Remove
            </button>
          </div>
        </div>

        {/* Price */}
        <div className="text-right">
          <p className="text-2xl font-bold text-charcoal-800 dark:text-cream-100">
            {formatPrice(item.price * item.quantity)}
          </p>
          <p className="text-sm text-charcoal-600 dark:text-cream-400">
            {formatPrice(item.price)} each
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
