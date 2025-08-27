import { useCallback, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebouncedCallback<T extends (...args: any[]) => void>(
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
