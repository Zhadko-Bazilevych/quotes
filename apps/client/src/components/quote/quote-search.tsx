import { Input } from '@/components/ui/input';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { quoteListRoute } from '@/routes/route-tree';
import { useNavigate, useSearch } from '@tanstack/react-router';
import React, { useCallback, useState, type JSX } from 'react';

export type SearchProps = {} & Omit<
  React.ComponentProps<'input'>,
  'onChange' | 'value'
>;

export const QuoteSearch = React.memo(function QuoteSearch(
  props: SearchProps,
): JSX.Element {
  const navigate = useNavigate({
    from: quoteListRoute.fullPath,
  });
  const initialQ = useSearch({
    from: quoteListRoute.fullPath,
    select: ({ q }) => q,
  });

  const [q, setQ] = useState(initialQ);

  const onChange = useCallback(
    (value: string) => {
      void navigate({
        search: (prev) => ({ ...prev, q: value }),
      });
    },
    [navigate],
  );
  const { debouncedChange } = useDebouncedCallback(onChange, 500);

  return (
    <Input
      onChange={(e) => {
        setQ(e.target.value);
        debouncedChange(e.target.value);
      }}
      value={q}
      name="quoteSearchInput"
      {...props}
    />
  );
});
