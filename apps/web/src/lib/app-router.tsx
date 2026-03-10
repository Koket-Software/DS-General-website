import type { QueryClient } from "@tanstack/react-query";
import {
  RouterProvider,
  createRouter,
  type RouterHistory,
} from "@tanstack/react-router";

import Loader from "@/components/loader";
import {
  dehydrateAppQueryClient,
  hydrateAppQueryClient,
  type AppRouterDehydratedState,
} from "@/lib/app-query-client";
import { AppProviders } from "@/providers/AppProviders";
import { routeTree } from "@/routeTree.gen";

export interface AppRouterContext {
  queryClient: QueryClient;
}

interface CreateAppRouterOptions {
  history?: RouterHistory;
  queryClient: QueryClient;
}

export function createAppRouter({
  history,
  queryClient,
}: CreateAppRouterOptions) {
  const router = createRouter({
    routeTree,
    history,
    defaultPreload: "intent",
    defaultPendingComponent: () => <Loader />,
    context: {
      queryClient,
    } satisfies AppRouterContext,
    Wrap: ({ children }) => (
      <AppProviders queryClient={queryClient}>{children}</AppProviders>
    ),
    dehydrate: () =>
      // TanStack Router's serializer typing is narrower than React Query's
      // DehydratedState shape, so we cast only at this SSR boundary.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dehydrateAppQueryClient(queryClient) as any,
    hydrate: async (dehydrated) =>
      hydrateAppQueryClient(
        queryClient,
        dehydrated as unknown as AppRouterDehydratedState | undefined,
      ),
  });

  return router;
}

export function AppRouterProvider({
  router,
}: {
  router: ReturnType<typeof createAppRouter>;
}) {
  return <RouterProvider router={router} />;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
