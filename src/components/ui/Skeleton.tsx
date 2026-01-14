import React from 'react';
import { cn } from '../../lib/utils';

/* eslint-disable react/no-array-index-key -- Skeleton components use index keys intentionally as they render static placeholder content */

interface SkeletonProps {
  className?: string;
}

/**
 * Base skeleton component with pulse animation
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div
    className={cn(
      'animate-pulse bg-cream-200 dark:bg-charcoal-700 rounded',
      className
    )}
  />
);

/**
 * Skeleton for text lines
 */
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 1,
  className
}) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={`skeleton-text-line-${i}`}
        className={cn(
          'h-4',
          i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
        )}
      />
    ))}
  </div>
);

/**
 * Skeleton for card components
 */
export const SkeletonCard: React.FC<SkeletonProps> = ({ className }) => (
  <div
    className={cn(
      'bg-cream-100 dark:bg-charcoal-800 rounded-2xl p-6 border border-cream-300 dark:border-charcoal-700',
      className
    )}
  >
    <div className="flex items-start gap-4">
      <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  </div>
);

/**
 * Skeleton for stats card
 */
export const SkeletonStatsCard: React.FC<SkeletonProps> = ({ className }) => (
  <div
    className={cn(
      'bg-cream-100 dark:bg-charcoal-800 rounded-2xl p-6 border border-cream-300 dark:border-charcoal-700',
      className
    )}
  >
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="w-10 h-10 rounded-xl" />
      <Skeleton className="w-16 h-6 rounded-full" />
    </div>
    <Skeleton className="h-8 w-24 mb-2" />
    <Skeleton className="h-4 w-20" />
  </div>
);

/**
 * Skeleton for table rows
 */
export const SkeletonTableRow: React.FC<{ columns?: number }> = ({ columns = 5 }) => (
  <tr className="border-b border-cream-200 dark:border-charcoal-700">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={`skeleton-table-col-${i}`} className="px-4 py-3">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

/**
 * Skeleton for service/product cards
 */
export const SkeletonServiceCard: React.FC<SkeletonProps> = ({ className }) => (
  <div
    className={cn(
      'bg-cream-100 dark:bg-charcoal-800 rounded-2xl p-6 border border-cream-300 dark:border-charcoal-700',
      className
    )}
  >
    <Skeleton className="w-16 h-16 rounded-xl mx-auto mb-4" />
    <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
    <Skeleton className="h-4 w-full mb-1" />
    <Skeleton className="h-4 w-2/3 mx-auto mb-4" />
    <Skeleton className="h-10 w-full rounded-xl" />
  </div>
);

/**
 * Skeleton for avatar/profile image
 */
export const SkeletonAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return <Skeleton className={cn('rounded-full', sizeClasses[size])} />;
};

/**
 * Skeleton for list items
 */
export const SkeletonListItem: React.FC<SkeletonProps> = ({ className }) => (
  <div className={cn('flex items-center gap-4 p-4', className)}>
    <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
    <div className="flex-1">
      <Skeleton className="h-4 w-1/3 mb-2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
    <Skeleton className="w-20 h-8 rounded-lg" />
  </div>
);

/**
 * Skeleton for dashboard grid
 */
export const SkeletonDashboard: React.FC = () => (
  <div className="space-y-6">
    {/* Stats grid */}
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonStatsCard key={`skeleton-stats-${i}`} />
      ))}
    </div>
    
    {/* Content sections */}
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="bg-cream-100 dark:bg-charcoal-800 rounded-2xl p-6 border border-cream-300 dark:border-charcoal-700">
        <Skeleton className="h-6 w-1/3 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonListItem key={`skeleton-list-left-${i}`} />
          ))}
        </div>
      </div>
      <div className="bg-cream-100 dark:bg-charcoal-800 rounded-2xl p-6 border border-cream-300 dark:border-charcoal-700">
        <Skeleton className="h-6 w-1/3 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonListItem key={`skeleton-list-right-${i}`} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

/**
 * Skeleton for services grid
 */
export const SkeletonServicesGrid: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonServiceCard key={`skeleton-service-${i}`} />
    ))}
  </div>
);

export default Skeleton;
