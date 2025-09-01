import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { type JSX } from 'react';
import { useSearch } from '@tanstack/react-router';
import { quoteListRoute, router } from '@/routes/route-tree';
import {
  ArrowDownWideNarrowIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpWideNarrowIcon,
  XIcon,
} from 'lucide-react';
import {
  sortFields,
  type SortField,
  type SortOption,
} from '@/pages/quote-list-schema';
import React from 'react';

const namesMap: Record<SortField, string> = {
  author: 'Author',
  user: 'User',
  createdAt: 'Created At',
  updatedAt: 'UpdatedAt',
};

export const QuoteOrder = React.memo(function QuoteOrder(): JSX.Element {
  const sortOptions = useSearch({
    from: quoteListRoute.fullPath,
    select: ({ sort }) => sort,
  });

  const availableSorts = sortFields.filter(
    (sortField) => !sortOptions.some((s) => s.field === sortField),
  );

  const updateSortOption = (
    oldField: SortField,
    sortOption: SortOption,
  ): void => {
    void router.navigate({
      from: quoteListRoute.fullPath,
      search: (prevSearch) => {
        const index = prevSearch.sort.findIndex(
          (prevSortOption) => prevSortOption.field === oldField,
        );
        if (index === -1) {
          return prevSearch;
        }

        return {
          ...prevSearch,
          sort: [
            ...prevSearch.sort.slice(0, index),
            sortOption,
            ...prevSearch.sort.slice(index + 1),
          ],
        };
      },
    });
  };

  const deleteSortOption = (sortField: SortField): void => {
    void router.navigate({
      from: quoteListRoute.fullPath,
      search: (prevSearch) => {
        const newSortOptions = prevSearch.sort.filter(
          (prevSortOption) => prevSortOption.field !== sortField,
        );

        return {
          ...prevSearch,
          sort: newSortOptions,
        };
      },
    });
  };

  const addSortOption = (sortField: SortField): void => {
    void router.navigate({
      from: quoteListRoute.fullPath,
      search: (prevSearch) => {
        const exists = prevSearch.sort.some(
          (prevSortOption) => prevSortOption.field === sortField,
        );
        if (exists) {
          return prevSearch;
        }
        return {
          ...prevSearch,
          sort: [...prevSearch.sort, { field: sortField, order: 'asc' }],
        };
      },
    });
  };

  const swapSortOptions = (
    sortField: SortField,
    direction: 'left' | 'right',
  ): void => {
    const offset = direction === 'left' ? -1 : 1;
    void router.navigate({
      from: quoteListRoute.fullPath,
      search: (prevSearch) => {
        const index = prevSearch.sort.findIndex(
          (prevSortOption) => prevSortOption.field === sortField,
        );
        const targetIndex = index + offset;
        if (
          index < 0 ||
          index > prevSearch.sort.length ||
          targetIndex < 0 ||
          targetIndex > prevSearch.sort.length - 1
        ) {
          return prevSearch;
        }
        const newSort = [...prevSearch.sort];

        const targetOption = newSort[targetIndex];
        newSort[targetIndex] = newSort[index];
        newSort[index] = targetOption;

        return {
          ...prevSearch,
          sort: newSort,
        };
      },
    });
  };

  return (
    <div className="flex flex-wrap gap-3">
      {sortOptions.map((appliedSort, index) => {
        const options = [appliedSort.field, ...availableSorts];

        return (
          <div
            key={appliedSort.field}
            className="group relative flex max-sm:flex-1"
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                updateSortOption(appliedSort.field, {
                  field: appliedSort.field,
                  order: appliedSort.order === 'desc' ? 'asc' : 'desc',
                });
              }}
              className="rounded-r-none border-r-0"
            >
              {appliedSort.order === 'asc' ? (
                <ArrowUpWideNarrowIcon />
              ) : (
                <ArrowDownWideNarrowIcon />
              )}
            </Button>
            <Select
              value={appliedSort.field}
              onValueChange={(sortField: SortField) => {
                updateSortOption(appliedSort.field, {
                  field: sortField,
                  order: appliedSort.order,
                });
              }}
            >
              <SelectTrigger className="flex min-w-32 flex-1 rounded-none">
                <SelectValue placeholder={namesMap[appliedSort.field]} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {namesMap[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              className="rounded-l-none border-l-0"
              onClick={() => deleteSortOption(appliedSort.field)}
            >
              <XIcon className="text-destructive" />
            </Button>
            {sortOptions.length > 1 && (
              <div className="bg-card border-border absolute left-1/2 hidden -translate-x-1/2 -translate-y-full justify-center overflow-hidden rounded-t-md border border-b-0 group-hover:flex">
                {index > 0 && (
                  <Button
                    variant="ghost"
                    className="border-input size-6 rounded-none"
                    onClick={() => {
                      swapSortOptions(appliedSort.field, 'left');
                    }}
                  >
                    <ArrowLeftIcon />
                  </Button>
                )}
                {index < sortOptions.length - 1 && (
                  <Button
                    variant="ghost"
                    className="border-input size-6 rounded-none"
                    onClick={() => {
                      swapSortOptions(appliedSort.field, 'right');
                    }}
                  >
                    <ArrowRightIcon />
                  </Button>
                )}
              </div>
            )}
          </div>
        );
      })}
      {!!availableSorts.length && (
        <Button
          className="flex min-w-50 p-0 max-sm:flex-1"
          onClick={() => {
            if (!availableSorts.length) {
              return;
            }

            addSortOption(availableSorts[0]);
          }}
        >
          Add sort
        </Button>
      )}
    </div>
  );
});
