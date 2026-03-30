import type { JSX } from 'react';

import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/icons';
import { authClient } from '@/lib/auth-client';

export function SignInWithGoogleButton(): JSX.Element {
  return (
    <Button
      aria-label="Sign in with Google"
      className="bg-primary flex items-center rounded-md"
      onClick={() => {
        void authClient.signIn.social({
          provider: 'google',
          callbackURL: window.location.origin,
        });
      }}
    >
      <GoogleIcon />
      <span>Sign in with Google</span>
    </Button>
  );
}
