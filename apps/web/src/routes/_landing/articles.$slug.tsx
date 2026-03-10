import { createFileRoute } from "@tanstack/react-router";

import type { PublicBlogDetailResponse } from "@/lib/blogs/blogs-api";
import { publicBlogBySlugQueryOptions } from "@/lib/blogs/blogs-query";
import { buildArticleDetailHead } from "@/lib/seo";

export const Route = createFileRoute("/_landing/articles/$slug")({
  head: ({ loaderData, params }) => {
    const article = (loaderData as PublicBlogDetailResponse | undefined)?.data;

    if (!article) {
      return buildArticleDetailHead({
        slug: params.slug,
        title: params.slug,
      });
    }

    return buildArticleDetailHead({
      slug: params.slug,
      title: article.title,
      excerpt: article.excerpt,
      featuredImageUrl: article.featuredImageUrl,
      authorName: article.author?.name,
      publishDate: article.publishDate,
      updatedAt: article.updatedAt,
    });
  },
  loader: async ({ context, params }) => {
    const { slug } = params;

    return context.queryClient.ensureQueryData(
      publicBlogBySlugQueryOptions(slug),
    );
  },
});
