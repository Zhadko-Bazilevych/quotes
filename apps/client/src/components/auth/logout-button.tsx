import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import type { JSX } from 'react';

export default function LogoutButton(): JSX.Element {
  const logout = async (): Promise<void> => {
    await authClient.signOut();
  };

  return <Button onClick={() => void logout()}>Logout</Button>;
}
