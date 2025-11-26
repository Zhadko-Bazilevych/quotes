import { loginSchema } from '@/components/auth/auth.schema';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import type { LoginData } from '@/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useForm } from 'react-hook-form';

export type LoginFormProps = Omit<React.ComponentProps<'form'>, 'onSubmit'>;

export default function LoginForm({
  className,
  ...props
}: LoginFormProps): JSX.Element {
  const form = useForm<LoginData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
    criteriaMode: 'all',
    resolver: zodResolver(loginSchema),
  });
  const serverError = form.formState.errors.root;

  const onSubmit = async (data: LoginData): Promise<void> => {
    await authClient.signIn.email(data, {
      onError: (ctx) => {
        form.setError('password', {
          types: {
            server: ctx.error.message,
          },
        });
      },
    });
  };

  return (
    <Form {...form}>
      <form
        className={cn(className, 'flex flex-col')}
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        {...props}
      >
        {serverError && (
          <p className="text-destructive mb-1 text-sm">{serverError.message}</p>
        )}
        <FormField
          control={form.control}
          name="email"
          label="Email"
          render={(props) => <Input {...props} />}
        />
        <FormField
          control={form.control}
          name="password"
          label="Password"
          render={(props) => <Input type="password" {...props} />}
        />
        <Button className="mt-1 w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
