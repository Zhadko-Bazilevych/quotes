import type { InputHTMLAttributes, JSX } from 'react';
import { twMerge } from 'tailwind-merge';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...rest }: InputProps): JSX.Element {
  return (
    <input
      className={twMerge('border rounded border-gray-300 p-1', className)}
      {...rest}
    />
  );
}
