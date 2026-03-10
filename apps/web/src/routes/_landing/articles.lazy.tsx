import {
  Outlet,
  createLazyFileRoute,
  useRouterState,
} from "@tanstack/react-router";

import { ArticlesPage } from "@/features/landing/pages/ArticlesPage";

export const Route = createLazyFileRoute("/_landing/articles")({
  component: ArticlesRouteShell,
});

function ArticlesRouteShell() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  if (pathname.startsWith("/articles/")) {
    return <Outlet />;
  }

  return <ArticlesPage />;
}
