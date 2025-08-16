import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/lib/utils';
import type { JSX } from 'react';
import { buttonVariants, type ButtonVariants } from './button-variants';

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  ButtonVariants & {
    asChild?: boolean;
  }): JSX.Element {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
