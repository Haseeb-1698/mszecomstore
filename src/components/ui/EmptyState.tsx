import React from 'react';
import { Button } from './Button';

interface ActionProps {
  label: string;
  href?: string;
  onClick?: () => void;
  variant: 'primary' | 'outline';
}

const ActionButton: React.FC<ActionProps> = ({ label, href, onClick, variant }) => {
  const btn = <Button variant={variant} size="lg" onClick={onClick}>{label}</Button>;
  return href ? <a href={href}>{btn}</a> : btn;
};

const DEFAULT_ICON = (
  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
  </svg>
);

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  onSecondaryAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon, title, description, actionLabel, actionHref, onAction, 
  secondaryActionLabel, secondaryActionHref, onSecondaryAction
}) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="mb-6 text-charcoal-400 dark:text-cream-600">{icon || DEFAULT_ICON}</div>
    <h3 className="text-2xl font-bold text-charcoal-800 dark:text-cream-100 mb-3">{title}</h3>
    <p className="text-charcoal-600 dark:text-cream-400 mb-8 max-w-md">{description}</p>
    {(actionLabel || secondaryActionLabel) && (
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {actionLabel && <ActionButton label={actionLabel} href={actionHref} onClick={onAction} variant="primary" />}
        {secondaryActionLabel && <ActionButton label={secondaryActionLabel} href={secondaryActionHref} onClick={onSecondaryAction} variant="outline" />}
      </div>
    )}
  </div>
);

export default EmptyState;
