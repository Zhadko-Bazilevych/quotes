import type { JSX } from 'react';

export function QuoteCardSkeleton(): JSX.Element {
  return (
    <div className="flex flex-col gap-3 rounded animate-pulse p-3">
      <div className="flex justify-between">
        <div className="w-1/8 h-6 rounded"></div>
        <div className="w-1/5 h-6 rounded"></div>
      </div>
      <div className="w-1/3 h-6 rounded"></div>
    </div>
  );
}
