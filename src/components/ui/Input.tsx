import React, { type InputHTMLAttributes, useId } from 'react';

// Shared input styles
const inputBaseStyles = 'px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';
const inputNormalStyles = 'bg-cream-50 dark:bg-charcoal-800 border-cream-400 dark:border-charcoal-700 text-charcoal-800 dark:text-cream-100 placeholder-charcoal-700/50 dark:placeholder-cream-400/50 focus:border-coral-500 focus:ring-coral-500';
const inputErrorStyles = 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-600 text-charcoal-800 dark:text-cream-100 placeholder-red-400 focus:border-red-500 focus:ring-red-500';
const labelStyles = 'block text-sm font-medium text-charcoal-800 dark:text-cream-100 mb-2';
const errorTextStyles = 'mt-2 text-sm text-red-600 dark:text-red-400';
const helperTextStyles = 'mt-2 text-sm text-charcoal-700 dark:text-cream-400';

const getInputStyles = (error: boolean, fullWidth: boolean, className: string, extra = '') => 
  `${inputBaseStyles} ${error ? inputErrorStyles : inputNormalStyles} ${fullWidth ? 'w-full' : ''} ${extra} ${className}`;

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  className = '',
  id,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || `input-${generatedId}`;

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label htmlFor={inputId} className={labelStyles}>{label}</label>
      )}
      <input
        id={inputId}
        className={getInputStyles(!!error, fullWidth, className)}
        {...props}
      />
      {error && <p className={errorTextStyles}>{error}</p>}
      {helperText && !error && <p className={helperTextStyles}>{helperText}</p>}
    </div>
  );
};

export interface TextAreaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  rows?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  className = '',
  id,
  rows = 4,
  ...props
}) => {
  const generatedId = useId();
  const textareaId = id || `textarea-${generatedId}`;

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label htmlFor={textareaId} className={labelStyles}>{label}</label>
      )}
      <textarea
        id={textareaId}
        className={getInputStyles(!!error, fullWidth, className, 'resize-vertical')}
        rows={rows}
        {...props}
      />
      {error && <p className={errorTextStyles}>{error}</p>}
      {helperText && !error && <p className={helperTextStyles}>{helperText}</p>}
    </div>
  );
};
