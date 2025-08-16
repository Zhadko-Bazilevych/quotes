import { Button } from '@/components/ui/button';
import {
  AngleBracketLeft,
  AngleBracketRight,
  DoubleAngleBracketsLeft,
  DoubleAngleBracketsRight,
} from '@/components/ui/icons';
import { quoteListRoute } from '@/routes/route-tree';
import { Link } from '@tanstack/react-router';
import type { JSX } from 'react';

export type PaginationBarProps = {
  page: number;
  size: number;
  totalPages: number;
};

export function PaginationBar(props: PaginationBarProps): JSX.Element {
  const { page, size, totalPages } = props;
  return (
    <div className="flex gap-3 justify-center mb-2">
      {page > 2 && (
        <Link
          to={quoteListRoute.to}
          search={{
            page: 1,
            size,
          }}
        >
          <Button className="size-9">
            <DoubleAngleBracketsLeft />
          </Button>
        </Link>
      )}
      {page > 1 && (
        <Link
          to={quoteListRoute.to}
          search={{
            page: page - 1,
            size,
          }}
        >
          <Button className="size-9">
            <AngleBracketLeft />
          </Button>
        </Link>
      )}
      {Array.from({ length: totalPages }).map((_, idx) => {
        const isActive = idx + 1 === page;

        return (
          <Link
            key={idx}
            to={quoteListRoute.to}
            search={{
              page: idx + 1,
              size,
            }}
          >
            <Button
              className={`size-9 ${isActive && 'bg-gray-200 text-neutral-950 hover:bg-gray-400'}`}
            >
              {idx + 1}
            </Button>
          </Link>
        );
      })}
      {page < totalPages && (
        <Link
          to={quoteListRoute.to}
          search={{
            page: page + 1,
            size,
          }}
        >
          <Button className="size-9">
            <AngleBracketRight />
          </Button>
        </Link>
      )}
      {page < totalPages - 1 && (
        <Link
          to={quoteListRoute.to}
          search={{
            page: totalPages,
            size,
          }}
        >
          <Button className="size-9">
            <DoubleAngleBracketsRight />
          </Button>
        </Link>
      )}
    </div>
  );
}
