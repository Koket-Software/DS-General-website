import { createFileRoute } from "@tanstack/react-router";

import { ArticleDetailPage } from "@/features/landing/pages/ArticleDetailPage";
import { publicBlogBySlugQueryOptions } from "@/lib/blogs/blogs-query";
import { queryClient } from "@/main";

export const Route = createFileRoute("/_landing/articles/$slug")({
  loader: async ({ params }) => {
    const { slug } = params;

    await queryClient.ensureQueryData(publicBlogBySlugQueryOptions(slug));

    return null;
  },
  component: ArticleRoutePage,
});

function ArticleRoutePage() {
  const { slug } = Route.useParams();
  return <ArticleDetailPage slug={slug} />;
}
