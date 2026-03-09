import { createLazyFileRoute, getRouteApi } from "@tanstack/react-router";

import AchievementEdit from "@/features/dashboard/achievements/detail/AchievementEdit";

const routeApi = getRouteApi("/dashboard/achievements/$id/edit");

export const Route = createLazyFileRoute("/dashboard/achievements/$id/edit")({
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

  return <AchievementEdit achievementId={data.id} />;
}
