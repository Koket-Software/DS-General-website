import { TanStackDevtools } from "@tanstack/react-devtools";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import "../index.css";

import {
  RouteErrorPage,
  RouteNotFoundPage,
} from "@/features/system/route-status-pages";

const TanStackRouterDevtoolsPanel = lazy(async () => {
  const module = await import("@tanstack/react-router-devtools");
  return { default: module.TanStackRouterDevtoolsPanel };
});
const ReactQueryDevtools = lazy(async () => {
  const module = await import("@tanstack/react-query-devtools");
  return { default: module.ReactQueryDevtools };
});

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: RouteErrorPage,
  notFoundComponent: RouteNotFoundPage,
});

function RootComponent() {
  if (!import.meta.env.DEV) {
    return <Outlet />;
  }

  return (
    <>
      <Outlet />
      <TanStackDevtools
        config={{
          position: "bottom-right",
        }}
        plugins={[
          {
            name: "TanStack Router",
            render: (
              <Suspense fallback={null}>
                <TanStackRouterDevtoolsPanel />
              </Suspense>
            ),
          },
        ]}
      />
      <Suspense fallback={null}>
        <ReactQueryDevtools buttonPosition="bottom-left" />
      </Suspense>
    </>
  );
}
