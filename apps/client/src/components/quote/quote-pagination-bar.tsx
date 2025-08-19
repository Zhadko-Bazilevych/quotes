import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
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

  const leftLimit = Math.max(1, page - 2);
  const rightLimit = Math.min(totalPages, page + 2);
  const length = rightLimit - leftLimit + 1;

  return (
    <Pagination>
      <PaginationContent>
        {page !== 1 && (
          <PaginationItem>
            <PaginationPrevious
              to={quoteListRoute.to}
              search={{ page: page - 1, size }}
            />
          </PaginationItem>
        )}
        {page > 3 && (
          <PaginationItem>
            <PaginationLink to={quoteListRoute.to} search={{ page: 1, size }}>
              1
            </PaginationLink>
          </PaginationItem>
        )}
        {page > 4 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {Array.from({ length }).map((_, arrayIdx) => {
          const pageNumber = arrayIdx + leftLimit;

          return (
            <PaginationItem key={arrayIdx}>
              <PaginationLink
                to={quoteListRoute.to}
                search={{ page: pageNumber, size }}
                isActive={pageNumber === page}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        {page < totalPages - 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {page < totalPages - 2 && (
          <PaginationItem>
            <PaginationLink
              to={quoteListRoute.to}
              search={{ page: totalPages, size }}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}
        {page !== totalPages && (
          <PaginationItem>
            <PaginationNext
              to={quoteListRoute.to}
              search={{ page: page + 1, size }}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
