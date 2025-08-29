import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { type JSX } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { quoteListRoute } from '@/routes/route-tree';
import {
  ArrowDownNarrowWideIcon,
  ArrowUpNarrowWideIcon,
  XIcon,
} from 'lucide-react';

const sortOptions = ['author', 'user', 'createdAt', 'updatedAt'] as const;

type SortOption = (typeof sortOptions)[number];

const namesMap = {
  author: 'Author',
  user: 'User',
  createdAt: 'Created At',
  updatedAt: 'UpdatedAt',
  '-author': 'Author',
  '-user': 'User',
  '-createdAt': 'Created At',
  '-updatedAt': 'UpdatedAt',
};

export function QuoteOrder(): JSX.Element {
  const navigate = useNavigate({
    from: quoteListRoute.fullPath,
  });

  const sort = useSearch({
    from: quoteListRoute.fullPath,
    select: ({ sort }) => sort,
  });

  const availableSorts = sortOptions.filter(
    (so) => !sort.includes(so) && !sort.includes(`-${so}`),
  );

  return (
    <div className="flex flex-col flex-wrap gap-2">
      {sort.map((appliedSort) => {
        const options = [appliedSort, ...availableSorts];
        return (
          <div key={appliedSort} className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                void navigate({
                  search: (prev) => {
                    const index = prev.sort.indexOf(appliedSort);
                    if (index === -1) {
                      return prev;
                    }
                    const newSort = appliedSort.startsWith('-')
                      ? appliedSort.slice(1)
                      : `-${appliedSort}`;
                    return {
                      ...prev,
                      sort: [
                        ...prev.sort.slice(0, index),
                        newSort as SortOption,
                        ...prev.sort.slice(index + 1),
                      ],
                    };
                  },
                });
              }}
            >
              {sortOptions.includes(appliedSort as SortOption) ? (
                <ArrowUpNarrowWideIcon />
              ) : (
                <ArrowDownNarrowWideIcon />
              )}
            </Button>
            <Select
              value={appliedSort}
              onValueChange={(newSort: SortOption) => {
                void navigate({
                  search: (prev) => {
                    const index = prev.sort.indexOf(appliedSort);
                    if (index === -1) {
                      return prev;
                    }
                    if (appliedSort.startsWith('-')) {
                      newSort = '-' + newSort;
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
                <SelectValue placeholder={namesMap[appliedSort]} />
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
              onClick={() => {
                void navigate({
                  search: (prev) => {
                    const index = prev.sort.indexOf(appliedSort);
                    if (index === -1) {
                      return prev;
                    }
                    return {
                      ...prev,
                      sort: [
                        ...prev.sort.slice(0, index),
                        ...prev.sort.slice(index + 1),
                      ],
                    };
                  },
                });
              }}
            >
              <XIcon className="text-destructive" />
            </Button>
          </div>
        );
      })}
      <Button
        onClick={() => {
          if (!availableSorts.length) {
            return;
          }

          void navigate({
            search: (prev) => ({
              ...prev,
              sort: [...prev.sort, availableSorts[0]],
            }),
          });
        }}
      >
        add
      </Button>
    </div>
  );
}
