import * as React from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { type Button, buttonVariants } from '@/components/ui/button';
import type { JSX } from 'react';
import { createLink } from '@tanstack/react-router';

function Pagination({
  className,
  ...props
}: React.ComponentProps<'nav'>): JSX.Element {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<'ul'>): JSX.Element {
  return (
    <ul
      data-slot="pagination-content"
      className={cn('flex flex-row items-center gap-1', className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>): JSX.Element {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
  React.ComponentProps<'a'>;

const PaginationLink = createLink(
  ({
    className,
    isActive,
    size = 'icon',
    ...props
  }: PaginationLinkProps): JSX.Element => {
    return (
      <a
        aria-current={isActive ? 'page' : undefined}
        data-slot="pagination-link"
        data-active={isActive}
        className={cn(
          buttonVariants({
            variant: isActive ? 'outline' : 'ghost',
            size,
          }),
          'transition-none',
          className,
        )}
        {...props}
      />
    );
  },
);

const PaginationPrevious = createLink(
  ({
    className,
    disabled,
    ...props
  }: React.ComponentProps<typeof PaginationLink>): JSX.Element => {
    return (
      <PaginationLink
        aria-label="Go to previous page"
        size="default"
        className={cn(
          'gap-1 px-2.5!',
          disabled && 'text-muted-foreground',
          className,
        )}
        disabled={disabled}
        {...props}
      >
        <ChevronLeftIcon />
        <span className="sm:max-xl:hidden">Prev</span>
      </PaginationLink>
    );
  },
);

const PaginationNext = createLink(
  ({
    className,
    disabled,
    ...props
  }: React.ComponentProps<typeof PaginationLink>): JSX.Element => {
    return (
      <PaginationLink
        aria-label="Go to next page"
        size="default"
        className={cn(
          'gap-1 px-2.5!',
          disabled && 'text-muted-foreground',
          className,
        )}
        disabled={disabled}
        {...props}
      >
        <span className="sm:max-xl:hidden">Next</span>
        <ChevronRightIcon />
      </PaginationLink>
    );
  },
);

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>): JSX.Element {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
