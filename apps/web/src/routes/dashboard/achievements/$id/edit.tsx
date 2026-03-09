import { createFileRoute } from "@tanstack/react-router";

import { fetchAchievementById } from "@/features/dashboard/achievements/lib/achievements-api";
import { achievementKeys } from "@/features/dashboard/achievements/lib/achievements-query";
import { prefetchResource } from "@/lib/prefetch";
import { queryClient } from "@/main";

export const Route = createFileRoute("/dashboard/achievements/$id/edit")({
  loader: async ({ params }: { params: { id: string } }) => {
    const id = Number(params.id);

    if (!Number.isFinite(id) || id <= 0) {
      throw new Error(
        "Missing achievement id. Please navigate from the achievements list.",
      );
    }

    await prefetchResource(queryClient, achievementKeys.detail(id), () =>
      fetchAchievementById(id),
    );

    return { id };
  },
});
