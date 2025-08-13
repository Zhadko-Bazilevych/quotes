import type { JSX } from 'react';

export function QuoteCardSkeleton(): JSX.Element {
  return (
    <div className="flex flex-col gap-3 rounded bg-neutral-900/20 animate-pulse p-3">
      <div className="flex justify-between">
        <div className="bg-neutral-900 w-1/8 h-6 rounded"></div>
        <div className="bg-neutral-900 w-1/5 h-6 rounded"></div>
      </div>
      <div className="bg-neutral-900 w-1/3 h-6 rounded"></div>
    </div>
  );
}
