import React, { type ButtonHTMLAttributes, type ReactNode } from 'react';

// Button style constants
const BASE_STYLES = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

const VARIANT_STYLES = {
  primary: 'bg-coral-500 hover:bg-coral-600 text-white focus:ring-coral-500 shadow-soft hover:shadow-soft-lg',
  secondary: 'bg-purple-500 hover:bg-purple-600 text-white focus:ring-purple-500 shadow-soft hover:shadow-soft-lg',
  outline: 'border-2 border-coral-500 text-coral-500 hover:bg-coral-50 dark:hover:bg-charcoal-800 dark:text-coral-400 dark:border-coral-400 focus:ring-coral-500',
  ghost: 'text-charcoal-800 dark:text-cream-100 hover:bg-cream-100 dark:hover:bg-charcoal-800 focus:ring-charcoal-700 dark:focus:ring-cream-400'
} as const;

const SIZE_STYLES = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-xl'
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANT_STYLES;
  size?: keyof typeof SIZE_STYLES;
  fullWidth?: boolean;
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}) => {
  const combinedStyles = `${BASE_STYLES} ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

  return (
    <button className={combinedStyles} disabled={disabled} {...props}>
      {children}
    </button>
  );
};
