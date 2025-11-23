import LoginForm from '@/components/auth/login';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState, type JSX } from 'react';

export type AuthModalProps = {
  onCancel?: () => void;
};

export default function AuthModal(): JSX.Element {
  // const { onCancel: toggleModal } = props;

  const [isLog, setIsLog] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsLog(true)}>Login</Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {isLog && 'Sign In'}
            {!isLog && 'Sign Up'}
          </DialogTitle>
        </DialogHeader>
        {isLog && (
          <div>
            <LoginForm className="mb-3" />
            <p>
              Don&#39;t have account?{' '}
              <a
                onClick={() => setIsLog(false)}
                className="text-fg-brand font-medium hover:underline"
              >
                Sign Up
              </a>
            </p>
          </div>
        )}
        {!isLog && (
          <div>
            <div className="mb-3">
              Sorry, we don&#39;t support register right now
            </div>
            <p>
              Already have account?{' '}
              <a
                onClick={() => setIsLog(true)}
                className="text-fg-brand font-medium hover:underline"
              >
                Sign In
              </a>
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
