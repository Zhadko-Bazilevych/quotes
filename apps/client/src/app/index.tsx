import type { JSX } from 'react';
import { Outlet } from '@tanstack/react-router';

export function App(): JSX.Element {
  return (
    <div className="flex justify-center">
      <div className="w-full sm:w-3/5 sm:min-w-160 px-2 my-2">
        <Outlet />
      </div>
    </div>
  );
}
