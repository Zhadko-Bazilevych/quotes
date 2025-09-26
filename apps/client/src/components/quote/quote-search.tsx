import { QuoteSearchHint } from '@/components/quote/quote-search-hint';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { quoteListRoute } from '@/routes/route-tree';
import { XIcon } from 'lucide-react';
import React, { useCallback, useState, type JSX } from 'react';

export type SearchProps = {} & Omit<
  React.ComponentProps<'input'>,
  'onChange' | 'value'
>;

export const QuoteSearch = React.memo(function QuoteSearch(
  props: SearchProps,
): JSX.Element {
  const navigate = quoteListRoute.useNavigate();
  const initialQ = quoteListRoute.useSearch({
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
  const [debouncedChange, clear] = useDebouncedCallback(onChange, 500);

  return (
    <div className="flex gap-3">
      <div className="relative flex-1">
        <Input
          onChange={(e) => {
            setQ(e.target.value);
            debouncedChange(e.target.value);
          }}
          value={q}
          name="quoteSearchInput"
          {...props}
        />
        <div className="bg-background absolute top-0 right-0 rounded-r-md">
          <Button
            className="bg-input/30 border-input rounded-l-none border"
            variant="secondary"
            size="icon"
            onClick={() => {
              clear();
              setQ('');
              onChange('');
            }}
          >
            <XIcon />
          </Button>
        </div>
      </div>
      <QuoteSearchHint />
    </div>
  );
});
