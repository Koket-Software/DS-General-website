import { createFileRoute } from "@tanstack/react-router";

import { fetchPublicBlogBySlug } from "@/features/blog/lib/blog-api";
import {
  buildSeoMeta,
  getBlogOgImageUrl,
  getDefaultOgImageUrl,
  SITE_METADATA,
} from "@/lib/og-utils";

export const Route = createFileRoute("/demo/blogs/$slug")({
  loader: async ({ params }: { params: Record<string, string> }) => {
    const data = await fetchPublicBlogBySlug(params.slug);
    return { blog: data.data };
  },
  head: ({ loaderData }) => {
    const blog = loaderData?.blog;
    const title = blog?.title
      ? `${blog.title} | ${SITE_METADATA.siteName}`
      : SITE_METADATA.defaultTitle;
    const description = blog?.excerpt || SITE_METADATA.defaultDescription;
    const ogImage = blog?.slug
      ? getBlogOgImageUrl(blog.slug)
      : getDefaultOgImageUrl();

    return buildSeoMeta({
      path: blog?.slug ? `/demo/blogs/${blog.slug}` : "/demo/blogs",
      title,
      description,
      ogImage,
      type: "article",
    });
  },
});
