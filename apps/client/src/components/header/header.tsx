import AuthModal from '@/components/auth/auth-modal';
import LogoutButton from '@/components/auth/logout-button';
import { authClient } from '@/lib/auth-client';
import type { JSX } from 'react';

export function Header(): JSX.Element {
  const { data, isPending } = authClient.useSession();
  const isSignIn = !isPending && data;

  return (
    <nav className="bg-card flex w-full items-center justify-between border p-2">
      <p>That One Quotes</p>
      <div className="flex items-center gap-2">
        <span>{isSignIn && `Hello there, ${data.user.name}`}</span>
        {!isSignIn && <AuthModal />}
        {isSignIn && <LogoutButton />}
      </div>
    </nav>
  );
}
