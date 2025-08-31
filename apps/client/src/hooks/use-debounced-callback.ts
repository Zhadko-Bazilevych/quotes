import { useCallback, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebouncedCallback<T extends (...args: any[]) => void>(
  cb: T,
  delay: number,
): {
  debouncedChange: (...args: Parameters<T>) => void;
  debouncedClear: () => void;
} {
  const timeout = useRef<number | undefined>(undefined);

  const debouncedChange = useCallback(
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

  const debouncedClear = () => clearTimeout(timeout.current);

  return { debouncedChange, debouncedClear };
}
