import { useCallback, useRef } from 'react';

type useDebouncedCallbackReturn<T extends (...args: any[]) => void> = {
  debouncedChange: (...args: Parameters<T>) => void;
  cancel: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebouncedCallback<T extends (...args: any[]) => void>(
  cb: T,
  delay: number,
): useDebouncedCallbackReturn<T> {
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

  const cancel = () => clearTimeout(timeout.current);

  return { debouncedChange, cancel };
}
