import type { RefObject } from 'react';
import React from 'react';

export function useComboboxAnchor(): RefObject<HTMLDivElement | null> {
  return React.useRef<HTMLDivElement | null>(null);
}
