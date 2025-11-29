import { type JSX, useState } from 'react';

import { DialogTitle } from '@radix-ui/react-dialog';
import { TabsContent } from '@radix-ui/react-tabs';

import LoginForm from '@/components/auth/login-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AuthModal(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            <LoginForm className="mb-3" />
          </TabsContent>
          <TabsContent value="signUp">
            <p>Sorry, we don&#39;t support registering right now</p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
