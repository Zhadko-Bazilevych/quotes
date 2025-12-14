import { type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import type { JSX } from 'react/jsx-runtime';

import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/lib/utils';

import { badgeVariants } from './badge-variants';

export function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }): JSX.Element {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}
