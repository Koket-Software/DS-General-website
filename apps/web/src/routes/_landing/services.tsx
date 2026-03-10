import {
  Outlet,
  createFileRoute,
  useRouterState,
} from "@tanstack/react-router";

import { ServicesPage } from "@/features/landing/pages/ServicesPage";
import { publicServicesQueryOptions } from "@/lib/services/services-query";
import { queryClient } from "@/main";

export const Route = createFileRoute("/_landing/services")({
  loader: async () => {
    await queryClient.ensureQueryData(
      publicServicesQueryOptions({
        page: 1,
        limit: 12,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
    );

    return null;
  },
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
