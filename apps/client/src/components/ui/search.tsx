import { Input } from '@/components/ui/input';
import { useCallback, useEffect, useState, type JSX } from 'react';

type SearchProps = {
  value: string;
  setValue: (value: string) => void;
} & React.ComponentProps<'input'>;

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function Search(props: SearchProps): JSX.Element {
  const { value, setValue, ...rest } = props;

  const debouncedChange = useDebounce((inputValue: string) => {
    setValue(inputValue);
  }, 1000);

  return (
    <div className="flex w-full items-center gap-2">
      <Input
        onChange={(e) => {
          debouncedChange(e.target.value);
        }}
        {...rest}
      />
    </div>
  );
}
