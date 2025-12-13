import type { JSX } from 'react';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

export function LogoutButton(): JSX.Element {
  const logout = async (): Promise<void> => {
    await authClient.signOut();
  };

  return <Button onClick={() => void logout()}>Logout</Button>;
}
