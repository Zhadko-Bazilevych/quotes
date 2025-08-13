import type { JSX } from 'react';

export function UnexpectedError(): JSX.Element {
  return (
    <section role="alert">
      <h2 className="text-3xl">Something went wrong</h2>
      <p>Please try again later.</p>
    </section>
  );
}
