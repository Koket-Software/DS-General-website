import { TanStackDevtools } from "@tanstack/react-devtools";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import "../index.css";

const TanStackRouterDevtoolsPanel = lazy(async () => {
  const module = await import("@tanstack/react-router-devtools");
  return { default: module.TanStackRouterDevtoolsPanel };
});

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
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
    </>
  );
}
