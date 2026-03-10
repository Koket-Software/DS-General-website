import { createFileRoute } from "@tanstack/react-router";

import { fetchClientProjectById } from "@/features/dashboard/client-projects/lib/client-projects-api";
import { clientProjectKeys } from "@/features/dashboard/client-projects/lib/client-projects-query";
import type { AppRouterContext } from "@/lib/app-router";
import { fetchPublicCaseStudyBySlug } from "@/lib/case-study/case-study-api";
import { prefetchResource } from "@/lib/prefetch";
import { parseSearchId, resolvePrefetchedSlugId } from "@/lib/route-loader";

export const Route = createFileRoute("/dashboard/client-projects/$slug/")({
  validateSearch: parseSearchId,
  loader: async ({
    context,
    search = {},
    params,
  }: {
    context: AppRouterContext;
    search?: Record<string, unknown>;
    params: { slug: string };
  }) => {
    const id = await resolvePrefetchedSlugId({
      rawId: search.id,
      slug: params.slug,
      fetchBySlug: fetchPublicCaseStudyBySlug,
      getIdFromSlugResponse: (response) => response?.data?.id,
      prefetchById: (resolvedId) =>
        prefetchResource(
          context.queryClient,
          clientProjectKeys.detail(resolvedId),
          () => fetchClientProjectById(resolvedId),
        ),
      missingIdMessage:
        "Missing client project identifier. Please navigate from the client projects list.",
    });
    return { id };
  },
});
