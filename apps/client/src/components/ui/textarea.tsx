import { cn } from '@/lib/utils';
import type { JSX, TextareaHTMLAttributes } from 'react';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...rest }: TextareaProps): JSX.Element {
  return <textarea className={cn('border rounded p-1', className)} {...rest} />;
}
