import type { JSX } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { loginSchema } from '@/components/auth/auth.schema';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { useSignInWithEmailResult } from '@/hooks/use-sign-in-with-email';
import { cn } from '@/lib/utils';
import type { LoginData } from '@/types/auth';

export type LoginFormProps = {
  signInMutation: useSignInWithEmailResult;
} & Omit<React.ComponentProps<'form'>, 'onSubmit'>;

export function LoginForm({
  className,
  signInMutation: { isPending, mutate },
  ...props
}: LoginFormProps): JSX.Element {
  const form = useForm<LoginData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onTouched',
    criteriaMode: 'all',
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginData): void => {
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

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col', className)}
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        {...props}
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
            <Input type="password" autoComplete="current-password" {...props} />
          )}
        />
        <Button className="mt-1 w-full" type="submit" disabled={isPending}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
