import type { ComponentProps, JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useSession } from '@/hooks/use-session';

export type AuthRequiredButtonProps = {
  mode?: 'hide' | 'disable' | 'toast';
  toastMessage?: string;
} & ComponentProps<typeof Button>;

export function AuthRequiredButton({
  children,
  mode = 'toast',
  toastMessage,
  onClick: onSuccess,
  ...props
}: AuthRequiredButtonProps): JSX.Element | null {
  const { data } = useSession();
  const { t } = useTranslation();

  if (!data && mode === 'hide') {
    return null;
  }

  const onClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    if (data) {
      onSuccess?.(e);
      return;
    }
    if (mode === 'toast') {
      toast.warning(
        toastMessage ??
          t(($) => $.quote.notifications.signInRequired, {
            defaultValue: 'You need to be signed in to perform this action.',
          }),
      );
    }
  };

  const isDisabled = !data && mode === 'disable';

  return (
    <Button {...props} onClick={onClick} disabled={isDisabled}>
      {children}
    </Button>
  );
}
