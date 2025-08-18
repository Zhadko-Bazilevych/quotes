import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { quoteListRoute } from '@/routes/route-tree';
import type { JSX } from 'react';

type QuotePaginationBarProps = {
  page: number;
  total: number;
  size: number;
};

export function QuotePaginationBar(
  props: QuotePaginationBarProps,
): JSX.Element {
  const { page, total, size } = props;
  const totalPages = Math.ceil(total / size);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {page !== 1 && (
            <PaginationPrevious
              to={quoteListRoute.to}
              search={{ page: page - 1, size }}
            />
          )}
        </PaginationItem>
        {Array.from({ length: totalPages }).map((_, idx) => {
          return (
            <PaginationItem key={idx}>
              <PaginationLink
                to={quoteListRoute.to}
                search={{ page: idx + 1, size }}
                isActive={page === idx + 1}
              >
                {idx + 1}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          {page !== totalPages && (
            <PaginationNext
              to={quoteListRoute.to}
              search={{ page: page + 1, size }}
            />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
