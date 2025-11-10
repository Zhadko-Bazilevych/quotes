import type { JSX } from 'react';

export type InlineCodeProps = {
  children: string;
};

export function InlineCode({ children }: InlineCodeProps): JSX.Element {
  return (
    <code className="bg-muted relative rounded px-1 py-0.5 font-mono text-sm text-neutral-300">
      {children}
    </code>
  );
}
