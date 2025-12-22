import { type JSX } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useSignOut } from '@/hooks/use-sign-out';

export function LogoutButton(): JSX.Element {
  const { isPending, mutate } = useSignOut();

  const logout = (): void => {
    mutate({
      fetchOptions: {
        onError(ctx) {
          toast.warning(ctx.error.message);
        },
      },
    });
  };

  return (
    <Button onClick={logout} disabled={isPending}>
      Logout
    </Button>
  );
}
