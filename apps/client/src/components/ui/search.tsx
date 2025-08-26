import { Input } from '@/components/ui/input';
import { quoteListRoute } from '@/routes/route-tree';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback, useRef, useState, type JSX } from 'react';

export type SearchProps = {} & Omit<
  React.ComponentProps<'input'>,
  'onChange' | 'value'
>;

// TODO: move this to it's own file
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useDebouncedCallback<T extends (...args: any[]) => void>(
  cb: T,
  delay: number,
): (...args: Parameters<T>) => void {
  const timeout = useRef<number | undefined>(undefined);

  return useCallback(
    (...args: Parameters<T>) => {
      const later = (): void => {
        clearTimeout(timeout.current);
        cb(...args);
      };

      clearTimeout(timeout.current);
      timeout.current = window.setTimeout(later, delay);
    },
    [cb, delay],
  );
}
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
