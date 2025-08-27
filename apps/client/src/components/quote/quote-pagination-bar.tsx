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
import { PAGINATION } from '@/utils/constants';
import { range } from '@/utils/range';

type PaginationConfig = {
  renderPrev: boolean;
  renderFirstEllipsis: boolean;
  pages: number[];
  renderLastEllipsis: boolean;
  renderLast: boolean;
  renderNext: boolean;
  renderLeftChevronsOnMobile: boolean;
  renderRightChevronsOnMobile: boolean;
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
  const intervalRadius = Math.floor(PAGINATION.MAX_DISPLAYED_PAGES / 2);

  let start = current - intervalRadius;
  let end = current + intervalRadius;

  if (start < 2) {
    end += 1 - start;
    start = 2;
  }
  if (end >= totalPages) {
    start -= end - totalPages;
    end = totalPages - 1;
    start = Math.max(2, start);
  }

  const renderPrev = current > 1;
  const renderNext = current < totalPages;
  const renderFirstEllipsis = start > 2;
  const renderLastEllipsis = end < totalPages - 1;
  const renderLast = totalPages > 1;

  const renderLeftChevronsOnMobile = current > intervalRadius + 1;
  const renderRightChevronsOnMobile = current < totalPages - intervalRadius;

  const pages = range(start, end + 1);

  return {
    renderPrev,
    renderFirstEllipsis,
    pages,
    renderLastEllipsis,
    renderLast,
    renderNext,
    renderLeftChevronsOnMobile,
    renderRightChevronsOnMobile,
  };
}

export type QuotePaginationBarProps = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export function QuotePaginationBar(
  props: QuotePaginationBarProps,
): JSX.Element {
  const { page, pageSize, totalPages, total } = props;

  const navigate = useNavigate({
    from: quoteListRoute.fullPath,
  });

  const {
    renderPrev,
    renderFirstEllipsis,
    pages,
    renderLastEllipsis,
    renderLast,
    renderNext,
    renderLeftChevronsOnMobile,
    renderRightChevronsOnMobile,
  } = getPaginationConfig({ page, totalPages });
  const isSizeDefault = PAGINATION.PAGE_SIZES.includes(pageSize);

  const firstItemIndex = (page - 1) * pageSize + 1;
  const lastItemIndex = Math.min(page * pageSize, total);

  return (
    <Pagination className="items-center gap-2 max-sm:flex-col">
      <span className="text-sm text-nowrap">
        {firstItemIndex} - {lastItemIndex} of {total}
      </span>
      <PaginationContent className="justify-center">
        {renderPrev && (
          <PaginationItem className="max-sm:hidden">
            <PaginationPrevious
              title="Go to previous page (Ctrl + Left Arrow)"
              from={quoteListRoute.fullPath}
              search={(prev) => ({ ...prev, page: page - 1 })}
            />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationLink
            from={quoteListRoute.fullPath}
            search={(prev) => ({ ...prev, page: 1 })}
            isActive={page === 1}
          >
            <span className={cn(renderLeftChevronsOnMobile && 'max-sm:hidden')}>
              1
            </span>
            <ChevronsLeftIcon
              className={cn(
                !renderLeftChevronsOnMobile && 'hidden',
                'sm:hidden',
              )}
            />
          </PaginationLink>
        </PaginationItem>
        {renderFirstEllipsis && (
          <PaginationItem className="max-sm:hidden">
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {pages.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              from={quoteListRoute.fullPath}
              search={(prev) => ({ ...prev, page: pageNumber })}
              isActive={pageNumber === page}
            >
              {pageNumber}
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
              from={quoteListRoute.fullPath}
              search={(prev) => ({ ...prev, page: totalPages })}
              isActive={page === totalPages}
            >
              <span
                className={cn(renderRightChevronsOnMobile && 'max-sm:hidden')}
              >
                {totalPages}
              </span>
              <ChevronsRightIcon
                className={cn(
                  !renderRightChevronsOnMobile && 'hidden',
                  'sm:hidden',
                )}
              />
            </PaginationLink>
          </PaginationItem>
        )}

        {renderNext && (
          <PaginationItem className="max-sm:hidden">
            <PaginationNext
              title="Go to next page (Ctrl + Right Arrow)"
              from={quoteListRoute.fullPath}
              search={(prev) => ({ ...prev, page: page + 1 })}
            />
          </PaginationItem>
        )}
      </PaginationContent>

      <div className="flex justify-center gap-2">
        <PaginationPrevious
          title="Go to previous page (Ctrl + Left Arrow)"
          className="sm:hidden"
          disabled={!renderPrev}
          from={quoteListRoute.fullPath}
          search={(prev) => ({ ...prev, page: page - 1 })}
        />
        <Select
          onValueChange={(pageSize) => {
            void navigate({
              search: (prev) => ({
                ...prev,
                page: 1,
                pageSize: Number(pageSize),
              }),
            });
          }}
          defaultValue={isSizeDefault ? String(pageSize) : undefined}
        >
          <SelectTrigger>
            <SelectValue placeholder={`${pageSize} / page`} />
          </SelectTrigger>
          <SelectContent>
            {PAGINATION.PAGE_SIZES.map((variant, idx) => (
              <SelectItem key={idx} value={String(variant)}>
                {`${variant} / page`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <PaginationNext
          title="Go to next page (Ctrl + Right Arrow)"
          className="sm:hidden"
          disabled={!renderNext}
          from={quoteListRoute.fullPath}
          search={(prev) => ({ ...prev, page: page + 1 })}
        />
      </div>
    </Pagination>
  );
}
