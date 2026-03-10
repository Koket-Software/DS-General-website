import {
  Outlet,
  createFileRoute,
  useRouterState,
} from "@tanstack/react-router";

import { ArticlesPage } from "@/features/landing/pages/ArticlesPage";
import { publicBlogsQueryOptions } from "@/lib/blogs/blogs-query";
import {
  normalizePublicBlogsParams,
  publicBlogsParamsSchema,
} from "@/lib/blogs/blogs-schema";
import { buildStaticPageHead } from "@/lib/seo";
import { publicTagsQueryOptions } from "@/lib/tags/tags-query";

const toFiniteNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const Route = createFileRoute("/_landing/articles")({
  head: () => buildStaticPageHead("/articles"),
  validateSearch: (search: Record<string, unknown>) =>
    publicBlogsParamsSchema.partial().parse({
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
  component: ArticlesRouteShell,
});

function ArticlesRouteShell() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  if (pathname.startsWith("/articles/")) {
    return <Outlet />;
  }

  return <ArticlesPage />;
}
