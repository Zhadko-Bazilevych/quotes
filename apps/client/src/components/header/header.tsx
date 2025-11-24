import AuthModal from '@/components/auth/auth-modal';
import LogoutButton from '@/components/auth/logout-button';
import { authClient } from '@/lib/auth-client';
import type { JSX } from 'react';

export function Header(): JSX.Element {
  const { data, isPending } = authClient.useSession();
  const isSignIn = !isPending && data;

  return (
    <div className="bg-card flex w-full items-center justify-between border p-2">
      <p>Hello there{isSignIn && `, ${data.user.name}`}</p>
      <div>
        {!isSignIn && <AuthModal />}
        {isSignIn && <LogoutButton />}
      </div>
    </div>
  );
}
