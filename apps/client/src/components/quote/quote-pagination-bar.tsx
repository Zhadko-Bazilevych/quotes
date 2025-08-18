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
  console.log(totalPages);
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious />
        </PaginationItem>
        {Array.from({ length: totalPages }).map((_, idx) => {
          return (
            <PaginationItem key={idx}>
              <PaginationLink
                to={quoteListRoute.to}
                search={{ page, size }}
                isActive={page === idx + 1}
              >
                {idx + 1}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
