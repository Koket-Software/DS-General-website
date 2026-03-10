import {
  Outlet,
  createLazyFileRoute,
  useRouterState,
} from "@tanstack/react-router";

import { CareerPage } from "@/features/landing/pages/CareerPage";

export const Route = createLazyFileRoute("/_landing/career")({
  component: CareerRouteShell,
});

function CareerRouteShell() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  if (pathname.startsWith("/career/")) {
    return <Outlet />;
  }

  return <CareerPage />;
}
