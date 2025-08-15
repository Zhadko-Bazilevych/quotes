import { Button } from '@/components/ui/button';
import {
  AngleBracketLeft,
  AngleBracketRight,
  DoubleAngleBracketsLeft,
  DoubleAngleBracketsRight,
} from '@/components/ui/icons';
import type { JSX } from 'react';

export type PaginationBarProps = {
  page: number;
  totalPages: number;
  onClick: (page: number) => void;
};

export function PaginationBar(props: PaginationBarProps): JSX.Element {
  const { page, totalPages, onClick } = props;
  return (
    <div className="flex gap-3 justify-center mb-2">
      {page > 2 && (
        <Button className="size-9" onClick={() => onClick(1)}>
          <DoubleAngleBracketsLeft />
        </Button>
      )}
      {page > 1 && (
        <Button className="size-9" onClick={() => onClick(page - 1)}>
          <AngleBracketLeft />
        </Button>
      )}
      {Array.from({ length: totalPages }).map((_, idx) => {
        const isActive = idx + 1 === page;

        return (
          <Button
            className={`size-9 ${isActive && 'bg-gray-200 text-neutral-950 hover:bg-gray-400'}`}
            key={idx}
            onClick={() => onClick(idx + 1)}
          >
            {idx}
          </Button>
        );
      })}
      {page < totalPages && (
        <Button className="size-9" onClick={() => onClick(page + 1)}>
          <AngleBracketRight />
        </Button>
      )}
      {page < totalPages - 1 && (
        <Button className="size-9" onClick={() => onClick(totalPages)}>
          <DoubleAngleBracketsRight />
        </Button>
      )}
    </div>
  );
}
