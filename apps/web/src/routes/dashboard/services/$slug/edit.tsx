import { createFileRoute } from "@tanstack/react-router";

import { fetchServiceById } from "@/features/dashboard/services/lib/services-api";
import { serviceKeys } from "@/features/dashboard/services/lib/services-query";
import type { AppRouterContext } from "@/lib/app-router";
import { prefetchResource } from "@/lib/prefetch";
import { parseSearchId, resolvePrefetchedSlugId } from "@/lib/route-loader";
import { fetchPublicServiceBySlug } from "@/lib/services/services-api";

export const Route = createFileRoute("/dashboard/services/$slug/edit")({
  validateSearch: parseSearchId,
  loader: async ({
    context,
    params,
    search = {},
  }: {
    context: AppRouterContext;
    params: { slug: string };
    search?: Record<string, unknown>;
  }) => {
    const id = await resolvePrefetchedSlugId({
      rawId: search.id,
      slug: params.slug,
      fetchBySlug: fetchPublicServiceBySlug,
      getIdFromSlugResponse: (response) => response?.data?.id,
      prefetchById: (resolvedId) =>
        prefetchResource(
          context.queryClient,
          serviceKeys.detail(resolvedId),
          () => fetchServiceById(resolvedId, { includeImages: true }),
        ),
      missingIdMessage:
        "Missing service identifier. Please navigate from the services list.",
    });
    return { id };
  },
});
