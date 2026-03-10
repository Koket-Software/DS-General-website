import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import "../index.css";

import { ManagedHeadPortal } from "@/components/system/ManagedHead";
import {
  RouteErrorPage,
  RouteNotFoundPage,
} from "@/features/system/route-status-pages";
import type { AppRouterContext } from "@/lib/app-router";

const TanStackDevtools = import.meta.env.DEV
  ? lazy(async () => {
      const module = await import("@tanstack/react-devtools");
      return { default: module.TanStackDevtools };
    })
  : null;
const TanStackRouterDevtoolsPanel = import.meta.env.DEV
  ? lazy(async () => {
      const module = await import("@tanstack/react-router-devtools");
      return { default: module.TanStackRouterDevtoolsPanel };
    })
  : null;
const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(async () => {
      const module = await import("@tanstack/react-query-devtools");
      return { default: module.ReactQueryDevtools };
    })
  : null;

export const Route = createRootRouteWithContext<AppRouterContext>()({
  component: RootComponent,
  errorComponent: RouteErrorPage,
  notFoundComponent: RouteNotFoundPage,
});

function RootComponent() {
  if (!import.meta.env.DEV) {
    return (
      <>
        <ManagedHeadPortal />
        <Outlet />
      </>
    );
  }

  return (
    <>
      <ManagedHeadPortal />
      <Outlet />
      {TanStackDevtools && TanStackRouterDevtoolsPanel ? (
        <Suspense fallback={null}>
          <TanStackDevtools
            config={{
              position: "bottom-right",
            }}
            plugins={[
              {
                name: "TanStack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        </Suspense>
      ) : null}
      {ReactQueryDevtools ? (
        <Suspense fallback={null}>
          <ReactQueryDevtools buttonPosition="bottom-left" />
        </Suspense>
      ) : null}
    </>
  );
}
