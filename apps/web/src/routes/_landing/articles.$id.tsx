import { createFileRoute } from "@tanstack/react-router";

import { ArticleDetailPage } from "@/features/landing/pages/ArticleDetailPage";

export const Route = createFileRoute("/_landing/articles/$id")({
  component: ArticleRoutePage,
});

function ArticleRoutePage() {
  const { id } = Route.useParams();
  return <ArticleDetailPage id={id} />;
}
