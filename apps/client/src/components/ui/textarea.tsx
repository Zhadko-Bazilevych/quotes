import type { JSX, TextareaHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...rest }: TextareaProps): JSX.Element {
  return (
    <textarea
      className={twMerge('border rounded p-1', className)}
      {...rest}
    />
  );
}
