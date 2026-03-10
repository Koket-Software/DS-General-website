import { createFileRoute } from "@tanstack/react-router";

import {
  fetchBlogById,
  fetchBlogBySlug,
} from "@/features/dashboard/blogs/lib/blogs-api";
import { blogKeys } from "@/features/dashboard/blogs/lib/blogs-query";
import type { AppRouterContext } from "@/lib/app-router";
import { prefetchResource } from "@/lib/prefetch";
import { parseSearchId, resolvePrefetchedSlugId } from "@/lib/route-loader";

export const Route = createFileRoute("/dashboard/blogs/$slug/")({
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
        prefetchResource(context.queryClient, blogKeys.slug(slug), () =>
          fetchBlogBySlug(slug),
        ),
      getIdFromSlugResponse: (response) => response?.data?.id,
      prefetchById: (resolvedId) =>
        prefetchResource(context.queryClient, blogKeys.detail(resolvedId), () =>
          fetchBlogById(resolvedId, { includeTags: true }),
        ),
      missingIdMessage:
        "Missing blog identifier. Please navigate from the blogs list.",
    });
    return { id };
  },
});
