import { QuoteCardSkeleton } from '@/components/quote/skeleton/quote-card-skeleton';
import type { JSX } from 'react';

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
