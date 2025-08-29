import { Input } from '@/components/ui/input';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { quoteListRoute } from '@/routes/route-tree';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback, useState, type JSX } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '../ui/button';
import React from 'react';
import type { QuoteListSearchDto } from '@/pages/quote-list-schema';

export type SearchProps = {} & Omit<
  React.ComponentProps<'input'>,
  'onChange' | 'value'
>;

const sortOptions = [
  'author',
  'user',
  'createdAt',
  'updatedAt',
  '-author',
  '-user',
  '-createdAt',
  '-updatedAt',
] as const;

export const QuoteSearch = React.memo(function QuoteSearch(
  props: SearchProps,
): JSX.Element {
  const navigate = useNavigate({
    from: quoteListRoute.fullPath,
  });
  const { q: initialQ = '', sort = [] } = useSearch({
    from: quoteListRoute.fullPath,
  });

  const availableSorts = sortOptions.filter((so) => !sort.includes(so));

  const [q, setQ] = useState(initialQ);

  const onChange = useCallback(
    (value: string) => {
      void navigate({
        search: (prev) => ({ ...prev, q: value }),
      });
    },
    [navigate],
  );
  const debouncedChange = useDebouncedCallback(onChange, 500);

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Input
        onChange={(e) => {
          setQ(e.target.value);
          debouncedChange(e.target.value);
        }}
        value={q}
        {...props}
      />
      <div className="flex flex-wrap gap-2">
        {sort.map((appliedSort) => {
          const options = [appliedSort, ...availableSorts];
          return (
            <Select
              key={appliedSort}
              value={appliedSort}
              onValueChange={(newSort) => {
                void navigate({
                  search: (prev: QuoteListSearchDto) => {
                    const index = prev.sort.indexOf(appliedSort);
                    if (index === -1) {
                      return prev;
                    }
                    return {
                      ...prev,
                      sort: [
                        ...prev.sort.slice(0, index),
                        newSort,
                        ...prev.sort.slice(index + 1),
                      ],
                    };
                  },
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={appliedSort} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        })}
        <Button
          onClick={() => {
            if (!availableSorts.length) {
              return;
            }

            void navigate({
              search: (prev: QuoteListSearchDto) => ({
                ...prev,
                sort: [...prev.sort, availableSorts[0]],
              }),
            });
          }}
        >
          add
        </Button>
        <Button
          onClick={() => {
            void navigate({
              search: (prev: QuoteListSearchDto) => ({
                ...prev,
                sort: prev.sort.slice(0, -1),
              }),
            });
          }}
        >
          remove
        </Button>
      </div>
    </div>
  );
});
