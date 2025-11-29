import type { JSX } from 'react';
import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Header } from '@/components/header';

export function App(): JSX.Element {
  return (
    <div className="flex flex-col items-center">
      <Header />
      <div className="my-2 w-full px-2 sm:w-3/5 sm:min-w-160">
        <Outlet />
        <TanStackRouterDevtools position="bottom-right" />
      </div>
    </div>
  );
}
