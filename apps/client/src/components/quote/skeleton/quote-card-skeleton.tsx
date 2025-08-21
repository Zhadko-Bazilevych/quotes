import { Skeleton } from '@/components/ui/skeleton';
import type { JSX } from 'react';

export function QuoteCardSkeleton(): JSX.Element {
  return (
    <div className="flex flex-col gap-3 rounded p-3 bg-card">
      <div className="flex justify-between">
        <Skeleton className="w-1/8 h-5 rounded" />
        <Skeleton className="w-1/5 h-5 rounded" />
      </div>
      <Skeleton className="w-1/3 h-5 rounded" />
    </div>
  );
}
