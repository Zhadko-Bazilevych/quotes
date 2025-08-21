import { App } from '@/app';
import { QuoteList } from '@/pages/quote-list';
import { quoteListQuerySchema } from '@/pages/quote-list-schema';
import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';

const rootRoute = createRootRoute({
  component: () => <App />,
});

export const quoteListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: QuoteList,
  validateSearch: quoteListQuerySchema,
});

export const routeTree = rootRoute.addChildren([quoteListRoute]);

export const router = createRouter({
  routeTree,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
