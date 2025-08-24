import { Skeleton } from '@/components/ui/skeleton';
import type { JSX } from 'react';

export function QuoteCardSkeleton(): JSX.Element {
  return (
    <div className="bg-card flex flex-col gap-3 rounded border p-2">
      <div className="flex justify-between">
        <Skeleton className="h-6 w-40 rounded" />
        <Skeleton className="h-6 w-60 rounded max-sm:hidden" />
      </div>
      <Skeleton className="h-6 w-3/4 rounded" />
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
