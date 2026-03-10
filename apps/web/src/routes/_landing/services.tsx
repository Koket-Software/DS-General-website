import {
  Outlet,
  createFileRoute,
  useRouterState,
} from "@tanstack/react-router";

import { ServicesPage } from "@/features/landing/pages/ServicesPage";
import { buildStaticPageHead } from "@/lib/seo";
import { publicServicesQueryOptions } from "@/lib/services/services-query";

export const Route = createFileRoute("/_landing/services")({
  head: () => buildStaticPageHead("/services"),
  loader: async ({ context }) => {
    return context.queryClient.ensureQueryData(
      publicServicesQueryOptions({
        page: 1,
        limit: 12,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
    );
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
