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

const DEFAULT_SIZE_VARIANTS = [10, 20, 30, 50];

type PaginationConfig = {
  renderPrev: boolean;
  renderFirstEllipsis: boolean;
  pages: number[];
  renderLastEllipsis: boolean;
  renderLast: boolean;
  renderNext: boolean;
};

type PaginationConfigInput = {
  page: number;
  totalPages: number;
};

const MAX_PAGES_TO_RENDER = 5;

function range(start: number, stop?: number): number[] {
  stop ??= start * 2;
  const add = stop ? start : 0;
  return Array.from({ length: stop - start }).map((_, i) => i + add);
}

function getPaginationConfig({
  page,
  totalPages,
}: PaginationConfigInput): PaginationConfig {
  const current = Math.min(Math.max(1, page), totalPages);
  const intervalRadius = Math.floor(MAX_PAGES_TO_RENDER / 2);

  let start = current - intervalRadius;
  let end = current + intervalRadius;

  if (start < 1) {
    end += 1 - start;
    start = 1;
  }
  if (end >= totalPages) {
    start -= end - totalPages;
    end = totalPages - 1;
  }
  start = Math.max(2, start);

  const renderPrev = current > 1;
  const renderNext = current < totalPages;
  const renderFirstEllipsis = start > 2;
  const renderLastEllipsis = end < totalPages - 1;
  const renderLast = totalPages !== 1;

  const pages = range(start, end + 1);

  return {
    renderPrev,
    renderFirstEllipsis,
    pages,
    renderLastEllipsis,
    renderLast,
    renderNext,
  };
}

export function QuotePaginationBar(
  props: QuotePaginationBarProps,
): JSX.Element {
  const navigate = useNavigate();

  const { page, total, size } = props;
  const totalPages = Math.ceil(total / size);

  const {
    renderPrev,
    renderFirstEllipsis,
    pages,
    renderLastEllipsis,
    renderLast,
    renderNext,
  } = getPaginationConfig({ page, totalPages });

  const isSizeDefault = DEFAULT_SIZE_VARIANTS.includes(size);

  return (
    <Pagination className="justify-end gap-1">
      <PaginationContent>
        {renderPrev && (
          <PaginationItem>
            <PaginationPrevious
              to={quoteListRoute.to}
              search={{ page: page - 1, size }}
            />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink
            to={quoteListRoute.to}
            search={{ page: 1, size }}
            isActive={page === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
        {renderFirstEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {pages.map((currentPage) => (
          <PaginationItem key={currentPage}>
            <PaginationLink
              to={quoteListRoute.to}
              search={{ page: currentPage, size }}
              isActive={currentPage === page}
            >
              {currentPage}
            </PaginationLink>
          </PaginationItem>
        ))}
        {renderLastEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {renderLast && (
          <PaginationItem>
            <PaginationLink
              to={quoteListRoute.to}
              search={{ page: totalPages, size }}
              isActive={page === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}
        {renderNext && (
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
          {DEFAULT_SIZE_VARIANTS.map((variant, idx) => (
            <SelectItem key={idx} value={String(variant)}>
              {`${variant} / page`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Pagination>
  );
}
