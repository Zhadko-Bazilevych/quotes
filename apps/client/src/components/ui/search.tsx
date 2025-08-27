import { Input } from '@/components/ui/input';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { quoteListRoute } from '@/routes/route-tree';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback, useState, type JSX } from 'react';

export type SearchProps = {} & Omit<
  React.ComponentProps<'input'>,
  'onChange' | 'value'
>;

export function Search(props: SearchProps): JSX.Element {
  const navigate = useNavigate({
    from: '/',
  });
  const { q: initialQ = '' } = useSearch({
    from: quoteListRoute.fullPath,
  });

  const [q, setQ] = useState<string>(initialQ);

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
    <div className="flex w-full items-center gap-2">
      <Input
        onChange={(e) => {
          setQ(e.target.value);
          debouncedChange(e.target.value);
        }}
        value={q}
        {...props}
      />
    </div>
  );
}
