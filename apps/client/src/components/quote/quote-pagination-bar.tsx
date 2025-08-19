import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { quoteListRoute } from '@/routes/route-tree';
import { useNavigate } from '@tanstack/react-router';
import type { JSX } from 'react';

type QuotePaginationBarProps = {
  page: number;
  total: number;
  size: number;
};

const defaultSizeVariants = [5, 10, 20, 30, 50];

export function QuotePaginationBar(
  props: QuotePaginationBarProps,
): JSX.Element {
  const navigate = useNavigate();

  const { page, total, size } = props;
  const totalPages = Math.ceil(total / size);

  const leftLimit = Math.max(1, page - 2);
  const rightLimit = Math.min(totalPages, page + 2);
  const length = rightLimit - leftLimit + 1;

  const isSizeDefault = defaultSizeVariants.includes(size);

  return (
    <Pagination className="gap-1">
      <PaginationContent>
        {page > 1 && (
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
        {page < totalPages && (
          <PaginationItem>
            <PaginationNext
              to={quoteListRoute.to}
              search={{ page: page + 1, size }}
            />
          </PaginationItem>
        )}
      </PaginationContent>
      <Select
        onValueChange={(value) => {
          const size = Number(value);
          void navigate({
            to: quoteListRoute.to,
            search: {
              page: 1,
              size,
            },
          });
        }}
        defaultValue={isSizeDefault ? String(size) : undefined}
      >
        <SelectTrigger className="w-30">
          <SelectValue placeholder={`${size} / page`} />
        </SelectTrigger>
        <SelectContent>
          {defaultSizeVariants.map((variant, idx) => (
            <SelectItem key={idx} value={String(variant)}>
              {`${variant} / page`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Pagination>
  );
}
