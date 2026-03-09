import { createLazyFileRoute } from "@tanstack/react-router";

import { AchievementForm } from "@/features/dashboard/achievements/AchievementForm";

export const Route = createLazyFileRoute("/dashboard/achievements/create")({
  component: () => <AchievementForm mode="create" />,
});
