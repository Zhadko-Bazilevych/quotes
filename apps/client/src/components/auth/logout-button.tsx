import { type JSX, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

export function LogoutButton(): JSX.Element {
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const logout = async (): Promise<void> => {
    setIsLoggingOut(true);
    await authClient.signOut({
      fetchOptions: {
        onError: (ctx) => {
          toast.warning(ctx.error.message);
        },
      },
    });
    setIsLoggingOut(false);
  };

  return (
    <Button onClick={() => void logout()} disabled={isLoggingOut}>
      Logout
    </Button>
  );
}
