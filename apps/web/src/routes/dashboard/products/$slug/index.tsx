import { createFileRoute } from "@tanstack/react-router";

import { fetchProductById } from "@/features/dashboard/products/lib/products-api";
import { productKeys } from "@/features/dashboard/products/lib/products-query";
import type { AppRouterContext } from "@/lib/app-router";
import { prefetchResource } from "@/lib/prefetch";
import { fetchPublicProductBySlug } from "@/lib/products/products-api";
import { parseSearchId, resolvePrefetchedSlugId } from "@/lib/route-loader";

export const Route = createFileRoute("/dashboard/products/$slug/")({
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
      fetchBySlug: fetchPublicProductBySlug,
      getIdFromSlugResponse: (response) => response?.data?.id,
      prefetchById: (resolvedId) =>
        prefetchResource(
          context.queryClient,
          productKeys.detail(resolvedId),
          () => fetchProductById(resolvedId),
        ),
      missingIdMessage:
        "Missing product identifier. Please navigate from the products list.",
    });
    return { id };
  },
});
