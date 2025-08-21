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
import { cn } from '@/lib/utils';
import { quoteListRoute } from '@/routes/route-tree';
import { useNavigate } from '@tanstack/react-router';
import { ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react';
import type { JSX } from 'react';
import {
  PAGINATION_BAR_INTERVAL_SIZE,
  PAGINATION_SIZE_VARIANTS,
} from '@/utils/constrants';
import { range } from '@/utils/range';

type QuotePaginationBarProps = {
  page: number;
  total: number;
  size: number;
};

type PaginationConfig = {
  renderPrev: boolean;
  renderFirstEllipsis: boolean;
  pages: number[];
  renderLastEllipsis: boolean;
  renderLast: boolean;
  renderNext: boolean;
  applyLeftChevrons: boolean;
  applyRightChevrons: boolean;
};

type PaginationConfigInput = {
  page: number;
  totalPages: number;
};

function getPaginationConfig({
  page,
  totalPages,
}: PaginationConfigInput): PaginationConfig {
  const current = Math.min(Math.max(1, page), totalPages);
  const intervalRadius = Math.floor(PAGINATION_BAR_INTERVAL_SIZE / 2);

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
  const renderLast = totalPages > 1;

  const applyLeftChevrons = current <= intervalRadius + 1;
  const applyRightChevrons = current >= totalPages - intervalRadius;

  const pages = range(start, end + 1);

  return {
    renderPrev,
    renderFirstEllipsis,
    pages,
    renderLastEllipsis,
    renderLast,
    renderNext,
    applyLeftChevrons,
    applyRightChevrons,
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
    applyLeftChevrons,
    applyRightChevrons,
  } = getPaginationConfig({ page, totalPages });
  const isSizeDefault = PAGINATION_SIZE_VARIANTS.includes(size);

  return (
    <Pagination className="max-sm:flex-col gap-2">
      <PaginationContent className="justify-center">
        {renderPrev && (
          <PaginationItem className="max-sm:hidden">
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
            <span className={cn(!applyLeftChevrons && 'max-sm:hidden')}>1</span>
            <ChevronsLeftIcon
              className={cn(applyLeftChevrons && 'hidden', 'sm:hidden')}
            />
          </PaginationLink>
        </PaginationItem>
        {renderFirstEllipsis && (
          <PaginationItem className="max-sm:hidden">
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
          <PaginationItem className="max-sm:hidden">
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
              <span className={cn(!applyRightChevrons && 'max-sm:hidden')}>
                {totalPages}
              </span>
              <ChevronsRightIcon
                className={cn(applyRightChevrons && 'hidden', 'sm:hidden')}
              />
            </PaginationLink>
          </PaginationItem>
        )}

        {renderNext && (
          <PaginationItem className="max-sm:hidden">
            <PaginationNext
              to={quoteListRoute.to}
              search={{ page: page + 1, size }}
            />
          </PaginationItem>
        )}
      </PaginationContent>

      <div className="flex justify-center gap-2">
        {renderPrev && (
          <PaginationPrevious
            className="sm:hidden"
            to={quoteListRoute.to}
            search={{ page: page - 1, size }}
          />
        )}
        <Select
          onValueChange={(value) => {
            void navigate({
              to: quoteListRoute.to,
              search: {
                page: 1,
                size: Number(value),
              },
            });
          }}
          defaultValue={isSizeDefault ? String(size) : undefined}
        >
          <SelectTrigger>
            <SelectValue placeholder={`${size} / page`} />
          </SelectTrigger>
          <SelectContent>
            {PAGINATION_SIZE_VARIANTS.map((variant, idx) => (
              <SelectItem key={idx} value={String(variant)}>
                {`${variant} / page`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {renderNext && (
          <PaginationNext
            className="sm:hidden"
            to={quoteListRoute.to}
            search={{ page: page + 1, size }}
          />
        )}
      </div>
    </Pagination>
  );
}
