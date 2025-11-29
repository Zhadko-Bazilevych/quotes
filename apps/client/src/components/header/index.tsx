import type { JSX } from 'react';

import AuthModal from '@/components/auth/auth-modal';
import LogoutButton from '@/components/auth/logout-button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from '@/hooks/use-session';

export function Header(): JSX.Element {
  const { data, isPending } = useSession();

  return (
    <header className="bg-card flex w-full items-center justify-between border p-2">
      <p>That One Quotes</p>
      <div className="flex items-center gap-2">
        <span>{data && `Hello there, ${data.user.name}`}</span>
        {data && <LogoutButton />}
        {isPending && <Skeleton className="bg-primary h-9 w-20 rounded-md" />}
        {!data && !isPending && <AuthModal />}
      </div>
    </header>
  );
}
