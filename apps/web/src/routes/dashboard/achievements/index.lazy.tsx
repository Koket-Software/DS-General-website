import { createLazyFileRoute } from "@tanstack/react-router";

import Achievements from "@/features/dashboard/achievements";
import { fetchAchievements } from "@/features/dashboard/achievements/lib/achievements-api";
import { achievementKeys } from "@/features/dashboard/achievements/lib/achievements-query";
import {
  achievementsListParamsSchema,
  normalizeAchievementsListParams,
} from "@/features/dashboard/achievements/lib/achievements-schema";
import { prefetchResource } from "@/lib/prefetch";
import { queryClient } from "@/main";

export const Route = createLazyFileRoute("/dashboard/achievements/")({
  validateSearch: (search: Record<string, unknown>) =>
    achievementsListParamsSchema.partial().parse({
      page: search.page ? Number(search.page) : undefined,
      limit: search.limit ? Number(search.limit) : undefined,
      search: typeof search.search === "string" ? search.search : undefined,
      sortBy: typeof search.sortBy === "string" ? search.sortBy : undefined,
      sortOrder:
        search.sortOrder === "asc" || search.sortOrder === "desc"
          ? search.sortOrder
          : undefined,
      isActive:
        typeof search.isActive === "boolean"
          ? search.isActive
          : typeof search.isActive === "string"
            ? search.isActive === "true"
            : undefined,
    }),
  loader: async ({ search }: { search: Record<string, unknown> }) => {
    const params = normalizeAchievementsListParams(search);

    await prefetchResource(queryClient, achievementKeys.list(params), () =>
      fetchAchievements(params),
    );

    return null;
  },
  component: Achievements,
});
