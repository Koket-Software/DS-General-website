import { createFileRoute } from "@tanstack/react-router";

import { ArticlesPage } from "@/features/landing/pages/ArticlesPage";

export const Route = createFileRoute("/_landing/articles")({
  component: ArticlesPage,
});
