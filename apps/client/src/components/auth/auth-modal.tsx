import { type JSX, useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { type LoginSchema, loginSchema } from '@/components/auth/auth.schema';
import { SignInWithGoogleButton } from '@/components/auth/sign-in-google-button';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSignInWithEmail } from '@/hooks/use-sign-in-with-email';

export function AuthModal(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const { isPending, mutate } = useSignInWithEmail();

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
        <Button>Login</Button>
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
              label="Email"
              render={(props) => <Input autoComplete="email" {...props} />}
            />
            <FormField
              control={form.control}
              name="password"
              label="Password"
              render={(props) => (
                <Input
                  type="password"
                  autoComplete="current-password"
                  {...props}
                />
              )}
            />
            <Button className="mt-1 w-full" type="submit" disabled={isPending}>
              Submit
            </Button>
          </form>
        </Form>
        <span className="text-center">or</span>
        <SignInWithGoogleButton />
      </DialogContent>
    </Dialog>
  );
}
