import { createLazyFileRoute } from "@tanstack/react-router";

import { WorkSamplesPage } from "@/features/work-samples";

export const Route = createLazyFileRoute("/_site/projects/")({
  component: WorkSamplesRoute,
});

function WorkSamplesRoute() {
  return <WorkSamplesPage />;
}
