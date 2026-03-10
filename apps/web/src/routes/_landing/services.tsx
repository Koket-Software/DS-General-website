import { createFileRoute } from "@tanstack/react-router";

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
});
