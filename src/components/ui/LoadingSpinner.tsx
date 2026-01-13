import React from 'react';

const SIZES = { small: 'w-4 h-4', medium: 'w-8 h-8', large: 'w-12 h-12' } as const;
const COLORS = { coral: 'text-coral-500', purple: 'text-purple-500', white: 'text-white' } as const;
const TEXT_SIZES = { small: 'text-sm', medium: 'text-base', large: 'text-lg' } as const;

interface LoadingSpinnerProps {
  size?: keyof typeof SIZES;
  color?: keyof typeof COLORS;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', color = 'coral', text 
}) => (
  <div className="flex flex-col items-center justify-center gap-3">
    <svg
      className={`animate-spin ${SIZES[size]} ${COLORS[color]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
    {text && <p className={`${TEXT_SIZES[size]} ${COLORS[color]} font-medium`}>{text}</p>}
  </div>
);