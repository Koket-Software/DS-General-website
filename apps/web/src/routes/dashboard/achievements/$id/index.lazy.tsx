import { createLazyFileRoute, getRouteApi } from "@tanstack/react-router";

import AchievementView from "@/features/dashboard/achievements/detail/AchievementView";

const routeApi = getRouteApi("/dashboard/achievements/$id/");

export const Route = createLazyFileRoute("/dashboard/achievements/$id/")({
  component: RouteComponent,
});

function RouteComponent() {
  const data = routeApi.useLoaderData() as { id?: number } | undefined;

  if (!data?.id) {
    return (
      <div className="p-8 text-destructive">
        Unable to load achievement. Please return to the list and try again.
      </div>
    );
  }

  return <AchievementView achievementId={data.id} />;
}
