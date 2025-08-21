import { Skeleton } from '@/components/ui/skeleton';
import type { JSX } from 'react';

export function QuoteCardSkeleton(): JSX.Element {
  return (
    <div className="flex flex-col gap-3 rounded p-2 bg-card border">
      <div className="flex justify-between">
        <Skeleton className="w-40 h-6 rounded" />
        <Skeleton className="w-60 h-6 rounded max-sm:hidden" />
      </div>
      <Skeleton className="w-3/4 h-6 rounded" />
      <div className="flex justify-between">
        <Skeleton className="h-8 w-16" />
        <div className="flex gap-1">
          <Skeleton className="size-9" />
          <Skeleton className="size-9" />
        </div>
      </div>
    </div>
  );
}
