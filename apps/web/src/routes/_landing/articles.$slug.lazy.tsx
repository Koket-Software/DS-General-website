import { createLazyFileRoute } from "@tanstack/react-router";

import { ArticleDetailPage } from "@/features/landing/pages/ArticleDetailPage";

export const Route = createLazyFileRoute("/_landing/articles/$slug")({
  component: ArticleRoutePage,
});

function ArticleRoutePage() {
  const { slug } = Route.useParams();
  return <ArticleDetailPage slug={slug} />;
}
