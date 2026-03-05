import {
  Outlet,
  createFileRoute,
  useRouterState,
} from "@tanstack/react-router";

import { CareerPage } from "@/features/landing/pages/CareerPage";
import { publicVacanciesQueryOptions } from "@/lib/vacancies/vacancies-query";
import {
  normalizePublicVacanciesParams,
  publicVacanciesParamsSchema,
} from "@/lib/vacancies/vacancies-schema";
import { queryClient } from "@/main";

const toFiniteNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const Route = createFileRoute("/_landing/career")({
  validateSearch: (search: Record<string, unknown>) =>
    publicVacanciesParamsSchema.partial().parse({
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
  loader: async ({ deps }) => {
    const params = normalizePublicVacanciesParams(deps);

    await queryClient.ensureQueryData(publicVacanciesQueryOptions(params));

    return null;
  },
  component: CareerRouteShell,
});

function CareerRouteShell() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  if (pathname.startsWith("/career/")) {
    return <Outlet />;
  }

  return <CareerPage />;
}
