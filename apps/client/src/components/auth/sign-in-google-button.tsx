import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/icons';
import { authClient } from '@/lib/auth-client';

export function SignInWithGoogleButton(): JSX.Element {
  const { t } = useTranslation();
  return (
    <Button
      aria-label={t(($) => $.auth.button.googleSignIn, {
        defaultValue: 'Sign in with Google',
      })}
      className="bg-primary flex items-center rounded-md"
      onClick={() => {
        void authClient.signIn.social({
          provider: 'google',
          callbackURL: window.location.origin,
        });
      }}
    >
      <GoogleIcon />
      <span>
        {t(($) => $.auth.button.googleSignIn, {
          defaultValue: 'Sign in with Google',
        })}
      </span>
    </Button>
  );
}
