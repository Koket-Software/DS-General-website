import { createFileRoute } from "@tanstack/react-router";

import { buildLeafStaticPageHead } from "@/lib/seo";
import { publicVacanciesQueryOptions } from "@/lib/vacancies/vacancies-query";
import {
  normalizePublicVacanciesParams,
  publicVacanciesRouteSearchSchema,
} from "@/lib/vacancies/vacancies-schema";

const toFiniteNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const Route = createFileRoute("/_landing/career")({
  head: ({ match, matches }) =>
    buildLeafStaticPageHead("/career", { match, matches }),
  validateSearch: (search: Record<string, unknown>) =>
    publicVacanciesRouteSearchSchema.parse({
      page: toFiniteNumber(search.page),
      limit: toFiniteNumber(search.limit),
      search: typeof search.search === "string" ? search.search : undefined,
      sortBy: typeof search.sortBy === "string" ? search.sortBy : undefined,
      sortOrder:
        search.sortOrder === "asc" || search.sortOrder === "desc"
          ? search.sortOrder
          : undefined,
      openOnly:
        typeof search.openOnly === "boolean"
          ? search.openOnly
          : search.openOnly === "true"
            ? true
            : search.openOnly === "false"
              ? false
              : undefined,
    }),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    const params = normalizePublicVacanciesParams(deps);

    return context.queryClient.ensureQueryData(
      publicVacanciesQueryOptions(params),
    );
  },
});
