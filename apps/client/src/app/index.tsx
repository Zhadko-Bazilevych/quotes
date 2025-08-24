import type { JSX } from 'react';
import { Outlet } from '@tanstack/react-router';

export function App(): JSX.Element {
  return (
    <div className="flex justify-center">
      <div className="my-2 w-full px-2 sm:w-3/5 sm:min-w-160">
        <Outlet />
      </div>
    </div>
  );
}
