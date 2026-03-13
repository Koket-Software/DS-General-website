import { createLazyFileRoute } from "@tanstack/react-router";

import { ProjectDetailPage } from "@/features/landing/pages/ProjectDetailPage";

export const Route = createLazyFileRoute("/_landing/projects/$slug")({
  component: ProjectDetailRoutePage,
});

function ProjectDetailRoutePage() {
  const { slug } = Route.useParams();
  return <ProjectDetailPage slug={slug} />;
}
