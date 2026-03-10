import { createFileRoute } from "@tanstack/react-router";

import {
  fetchVacancyById,
  fetchVacancyBySlug,
} from "@/features/dashboard/vacancies/lib/vacancies-api";
import { vacancyKeys } from "@/features/dashboard/vacancies/lib/vacancies-query";
import type { AppRouterContext } from "@/lib/app-router";
import { prefetchResource } from "@/lib/prefetch";
import { parseSearchId, resolvePrefetchedSlugId } from "@/lib/route-loader";

export const Route = createFileRoute("/dashboard/vacancies/$slug/")({
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
      fetchBySlug: (slug) =>
        prefetchResource(context.queryClient, vacancyKeys.slug(slug), () =>
          fetchVacancyBySlug(slug),
        ),
      getIdFromSlugResponse: (response) => response?.data?.id,
      prefetchById: (resolvedId) =>
        prefetchResource(
          context.queryClient,
          vacancyKeys.detail(resolvedId),
          () => fetchVacancyById(resolvedId),
        ),
      missingIdMessage:
        "Missing vacancy identifier. Please navigate from the vacancies list.",
    });
    return { id };
  },
});
