import { type JSX, useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { DialogTitle } from '@radix-ui/react-dialog';
import { TabsContent } from '@radix-ui/react-tabs';

import { loginSchema } from '@/components/auth/auth.schema';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSignInWithEmail } from '@/hooks/use-sign-in-with-email';
import type { LoginData } from '@/types/auth';

export function AuthModal(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const { isPending, mutate } = useSignInWithEmail();

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
      <DialogContent aria-describedby={undefined} className="xs:w-fit">
        <Tabs defaultValue="account">
          <DialogHeader>
            <DialogTitle asChild>
              <TabsList>
                <TabsTrigger value="signIn">Sign In</TabsTrigger>
                <TabsTrigger value="signUp">Sing Up</TabsTrigger>
              </TabsList>
            </DialogTitle>
          </DialogHeader>
          <TabsContent value="signIn">
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
                <Button
                  className="mt-1 w-full"
                  type="submit"
                  disabled={isPending}
                >
                  Submit
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="signUp">
            <p>Sorry, we don&#39;t support registering right now</p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
