import { useCallback, useRef } from 'react';

export type UseDebouncedCallbackReturn<
  TCallback extends (...args: Parameters<TCallback>) => void,
> = [debounce: (...args: Parameters<TCallback>) => void, cancel: () => void];

export function useDebouncedCallback<
  TCallback extends (...args: Parameters<TCallback>) => void,
>(cb: TCallback, delay: number): UseDebouncedCallbackReturn<TCallback> {
  const timeout = useRef<number | undefined>(undefined);

  const debounce = useCallback(
    (...args: Parameters<TCallback>) => {
      const later = (): void => {
        clearTimeout(timeout.current);
        cb(...args);
      };

      clearTimeout(timeout.current);
      timeout.current = window.setTimeout(later, delay);
    },
    [cb, delay],
  );

  const cancel = (): void => clearTimeout(timeout.current);

  return [debounce, cancel];
}
