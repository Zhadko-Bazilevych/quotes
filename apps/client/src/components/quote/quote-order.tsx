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
  ArrowUpWideNarrowIcon,
  XIcon,
} from 'lucide-react';
import {
  sortFields,
  type SortField,
  type SortOption,
} from '@/pages/quote-list-schema';
import { cn } from '@/lib/utils';

const namesMap: Record<SortField, string> = {
  author: 'Author',
  user: 'User',
  createdAt: 'Created At',
  updatedAt: 'UpdatedAt',
};

export function QuoteOrder(): JSX.Element {
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

  return (
    <div className="flex flex-col flex-wrap gap-3">
      <div
        className={cn('flex flex-wrap gap-2', !sortOptions.length && 'hidden')}
      >
        {sortOptions.map((appliedSort) => {
          const options = [appliedSort.field, ...availableSorts];

          return (
            <div key={appliedSort.field} className="flex">
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
                <SelectTrigger className="w-32 rounded-none">
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
            </div>
          );
        })}
      </div>
      <Button
        onClick={() => {
          if (!availableSorts.length) {
            return;
          }

          addSortOption(availableSorts[0]);
        }}
        disabled={!availableSorts.length}
      >
        Add sort
      </Button>
    </div>
  );
}
