import {
  Outlet,
  createLazyFileRoute,
  useRouterState,
} from "@tanstack/react-router";

import { ProjectsPage } from "@/features/landing/pages/ProjectsPage";

export const Route = createLazyFileRoute("/_landing/projects")({
  component: ProjectsRouteShell,
});

function ProjectsRouteShell() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  if (pathname.startsWith("/projects/")) {
    return <Outlet />;
  }

  return <ProjectsPage />;
}
