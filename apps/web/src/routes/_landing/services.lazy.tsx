import {
  Outlet,
  createLazyFileRoute,
  useRouterState,
} from "@tanstack/react-router";

import { ServicesPage } from "@/features/landing/pages/ServicesPage";

export const Route = createLazyFileRoute("/_landing/services")({
  component: ServicesRouteShell,
});

function ServicesRouteShell() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  if (pathname.startsWith("/services/")) {
    return <Outlet />;
  }

  return <ServicesPage />;
}
