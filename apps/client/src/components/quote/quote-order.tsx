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

const sortOptions = ['author', 'user', 'createdAt', 'updatedAt'] as const;

type SortOption = (typeof sortOptions)[number];

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
    <div className="flex flex-wrap gap-2">
      {sort.map((appliedSort) => {
        const options = [appliedSort, ...availableSorts];
        return (
          <Select
            key={appliedSort}
            value={appliedSort}
            onValueChange={(newSort: SortOption) => {
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
            search: (prev) => ({
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
            search: (prev) => ({
              ...prev,
              sort: prev.sort.slice(0, -1),
            }),
          });
        }}
      >
        remove
      </Button>
    </div>
  );
}
