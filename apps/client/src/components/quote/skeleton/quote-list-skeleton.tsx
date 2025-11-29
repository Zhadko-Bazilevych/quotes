import type { JSX } from 'react';

import { QuoteCardSkeleton } from '@/components/quote/skeleton/quote-card-skeleton';

type QuoteListSkeletonProps = {
  pageSize: number;
};

export function QuoteListSkeleton(
  props: QuoteListSkeletonProps,
): JSX.Element[] {
  const { pageSize } = props;

  return Array.from({ length: pageSize }).map((_, idx) => (
    <QuoteCardSkeleton key={idx} />
  ));
}
