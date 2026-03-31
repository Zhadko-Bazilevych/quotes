import { type JSX, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { zodResolver } from '@hookform/resolvers/zod';

import { type LoginSchema, loginSchema } from '@/components/auth/auth.schema';
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSignInWithEmail } from '@/hooks/use-sign-in-with-email';

export function AuthModal(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const { isPending, mutate } = useSignInWithEmail();
  const { t } = useTranslation();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
    criteriaMode: 'all',
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginSchema): void => {
    mutate({
      data,
      options: {
        onError: (ctx) => {
          form.setError('password', {
            types: {
              server: ctx.error.message,
            },
          });
        },
      },
    });
  };

  const onModalChange = (state: boolean): void => {
    if (!isPending || state) {
      setIsOpen(state);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onModalChange}>
      <DialogTrigger asChild>
        <Button>
          {t(($) => $.auth.button.signIn, {
            defaultValue: 'Sign in',
          })}
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className="xs:w-fit py-8">
        <Form {...form}>
          <form
            className="flex flex-col"
            onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
          >
            <FormField
              control={form.control}
              name="email"
              label={t(($) => $.auth.modal.form.email, {
                defaultValue: 'Email',
              })}
              render={(props) => <Input autoComplete="email" {...props} />}
            />
            <FormField
              control={form.control}
              name="password"
              label={t(($) => $.auth.modal.form.password, {
                defaultValue: 'Password',
              })}
              render={(props) => (
                <Input
                  type="password"
                  autoComplete="current-password"
                  {...props}
                />
              )}
            />
            <Button className="mt-1 w-full" type="submit" disabled={isPending}>
              {t(($) => $.auth.modal.form.submit, {
                defaultValue: 'Sign in',
              })}
            </Button>
          </form>
        </Form>
        <span className="text-center">
          {t(($) => $.auth.modal.separator, {
            defaultValue: 'or',
          })}
        </span>
        <GoogleSignInButton />
      </DialogContent>
    </Dialog>
  );
}
