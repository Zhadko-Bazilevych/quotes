import type { JSX } from 'react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps): JSX.Element => {
  return (
    <Sonner
      className="toaster group"
      position="bottom-right"
      closeButton
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'flex items-center gap-3 w-100  bg-background text-popover-foreground border border-border rounded p-3',
          closeButton:
            'absolute right-0 top-0 translate-x-1/3 -translate-y-1/3 bg-background border border-border rounded-full size-5 flex justify-center items-center',
          title: 'text-sm font-bold',
          description: 'text-sm',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
