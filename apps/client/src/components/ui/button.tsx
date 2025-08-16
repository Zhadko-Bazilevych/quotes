import { cn } from '@/utils/cn';
import type { ButtonHTMLAttributes, JSX } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive?: boolean;
};

export function Button(props: ButtonProps): JSX.Element {
  const { children, className, isActive, ...rest } = props;

  return (
    <button
      className={cn(
        'border rounded border-gray-300 p-1 cursor-pointer hover:bg-neutral-900',
        className,
        isActive && 'bg-gray-200 text-neutral-950 hover:bg-gray-400',
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
