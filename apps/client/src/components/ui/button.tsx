import type { ButtonHTMLAttributes, JSX } from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: ButtonProps): JSX.Element {
  const { children, className, ...rest } = props;

  return (
    <button
      className={twMerge(
        'border rounded border-gray-300 p-1 cursor-pointer hover:bg-neutral-900',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
