import { createFileRoute } from "@tanstack/react-router";

import { buildSeoMeta, getPageOgImageUrl, SITE_METADATA } from "@/lib/og-utils";

const PAGE_TITLE = `Blog | ${SITE_METADATA.siteName}`;
const PAGE_DESCRIPTION =
  "Insights, tutorials, and updates from our engineering and product teams.";

export const Route = createFileRoute("/_site/blogs/")({
  head: () =>
    buildSeoMeta({
      path: "/demo/blogs",
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      ogImage: getPageOgImageUrl({
        title: "Blog",
        description: PAGE_DESCRIPTION,
        category: "Insights",
      }),
    }),
});
