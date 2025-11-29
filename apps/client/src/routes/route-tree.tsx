import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';

import { App } from '@/app';
import { QuoteList } from '@/pages/quote-list';
import { quoteListQuerySchema } from '@/pages/quote-list-schema';

const rootRoute = createRootRoute({
  component: () => <App />,
  validateSearch: quoteListQuerySchema,
});

export const quoteListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: QuoteList,
});

export const routeTree = rootRoute.addChildren([quoteListRoute]);

export const router = createRouter({
  scrollRestoration: true,
  routeTree,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
