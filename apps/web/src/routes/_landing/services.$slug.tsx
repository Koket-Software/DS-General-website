import { createFileRoute } from "@tanstack/react-router";

import { ServiceDetailPage } from "@/features/landing/pages/ServiceDetailPage";
import {
  publicServiceBySlugQueryOptions,
  publicServicesQueryOptions,
} from "@/lib/services/services-query";
import { queryClient } from "@/main";

export const Route = createFileRoute("/_landing/services/$slug")({
  loader: async ({ params }) => {
    const { slug } = params;

    await Promise.all([
      queryClient.ensureQueryData(publicServiceBySlugQueryOptions(slug)),
      queryClient.ensureQueryData(
        publicServicesQueryOptions({
          page: 1,
          limit: 8,
          sortBy: "createdAt",
          sortOrder: "desc",
        }),
      ),
    ]);

    return null;
  },
  component: ServiceDetailRoutePage,
});

function ServiceDetailRoutePage() {
  const { slug } = Route.useParams();
  return <ServiceDetailPage slug={slug} />;
}
