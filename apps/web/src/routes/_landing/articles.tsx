import { createFileRoute } from "@tanstack/react-router";

import { publicBlogsQueryOptions } from "@/lib/blogs/blogs-query";
import {
  normalizePublicBlogsParams,
  publicBlogsRouteSearchSchema,
} from "@/lib/blogs/blogs-schema";
import { buildLeafStaticPageHead } from "@/lib/seo";
import { publicTagsQueryOptions } from "@/lib/tags/tags-query";

const toFiniteNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const Route = createFileRoute("/_landing/articles")({
  head: ({ match, matches }) =>
    buildLeafStaticPageHead("/articles", { match, matches }),
  validateSearch: (search: Record<string, unknown>) =>
    publicBlogsRouteSearchSchema.parse({
      page: toFiniteNumber(search.page),
      limit: toFiniteNumber(search.limit),
      search: typeof search.search === "string" ? search.search : undefined,
      sortBy: typeof search.sortBy === "string" ? search.sortBy : undefined,
      sortOrder:
        search.sortOrder === "asc" || search.sortOrder === "desc"
          ? search.sortOrder
          : undefined,
      tagId: toFiniteNumber(search.tagId),
    }),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    const params = normalizePublicBlogsParams(deps);

    return Promise.all([
      context.queryClient.ensureQueryData(publicBlogsQueryOptions(params)),
      context.queryClient.ensureQueryData(
        publicTagsQueryOptions({ page: 1, limit: 50 }),
      ),
    ]);
  },
});
