import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from '@tanstack/react-router';

import { Toaster } from '@/components/ui/sonner';
import { i18n } from '@/i18n';
import { AbilityProvider } from '@/lib/casl/ability-provider';
import { router } from '@/routes/route-tree';

import './index.css';

if (import.meta.hot) {
  import.meta.hot.on('i18nReload', (): void => {
    void i18n.reloadResources().then(() => i18n.changeLanguage(i18n.language));
  });
}

const queryClient = new QueryClient();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('An unexpected error occurred');
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AbilityProvider>
        <Toaster />
        <RouterProvider router={router} />
        <ReactQueryDevtools buttonPosition="bottom-left" />
      </AbilityProvider>
    </QueryClientProvider>
  </StrictMode>,
);
