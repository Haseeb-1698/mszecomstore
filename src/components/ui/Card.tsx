import React, { type ReactNode, type HTMLAttributes } from 'react';

// Card style constants
const CARD_BASE = 'rounded-2xl transition-all duration-200';
const CARD_VARIANTS = {
  default: 'bg-cream-50 dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-700',
  elevated: 'bg-cream-50 dark:bg-charcoal-800 shadow-soft hover:shadow-soft-lg',
  outlined: 'bg-transparent border-2 border-cream-400 dark:border-charcoal-700'
} as const;
const CARD_PADDING = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' } as const;

// Shared text styles
const TITLE_STYLE = 'text-xl font-semibold text-charcoal-800 dark:text-cream-100';
const DESC_STYLE = 'text-sm text-charcoal-700 dark:text-cream-400 mt-1';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: keyof typeof CARD_VARIANTS;
  padding?: keyof typeof CARD_PADDING;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children, variant = 'default', padding = 'md', hover = false, className = '', ...props
}) => (
  <div 
    className={`${CARD_BASE} ${CARD_VARIANTS[variant]} ${CARD_PADDING[padding]} ${hover ? 'hover:shadow-soft-lg hover:scale-[1.02] cursor-pointer' : ''} ${className}`} 
    {...props}
  >
    {children}
  </div>
);

interface SimpleCardProps { children: ReactNode; className?: string; }

export const CardHeader: React.FC<SimpleCardProps> = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

export const CardTitle: React.FC<SimpleCardProps> = ({ children, className = '' }) => (
  <h3 className={`${TITLE_STYLE} ${className}`}>{children}</h3>
);

export const CardDescription: React.FC<SimpleCardProps> = ({ children, className = '' }) => (
  <p className={`${DESC_STYLE} ${className}`}>{children}</p>
);

export const CardContent: React.FC<SimpleCardProps> = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

export const CardFooter: React.FC<SimpleCardProps> = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-cream-400 dark:border-charcoal-700 ${className}`}>{children}</div>
);
