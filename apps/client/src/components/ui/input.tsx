import { cn } from '@/lib/utils';
import type { InputHTMLAttributes, JSX } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...rest }: InputProps): JSX.Element {
  return <input className={cn('border rounded p-1', className)} {...rest} />;
}
