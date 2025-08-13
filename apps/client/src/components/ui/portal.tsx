import type { JSX } from 'react';
import { createPortal } from 'react-dom';

type PortalProps = { children: JSX.Element };

export function Portal({ children }: PortalProps): JSX.Element {
  return createPortal(children, document.body);
}
