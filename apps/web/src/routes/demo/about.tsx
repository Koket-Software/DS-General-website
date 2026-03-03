import { createFileRoute } from "@tanstack/react-router";

import { buildSeoMeta, getPageOgImageUrl, SITE_METADATA } from "@/lib/og-utils";

const PAGE_TITLE = `About Us | ${SITE_METADATA.siteName}`;
const PAGE_DESCRIPTION =
  "Learn about our company - our mission, values, and the team behind innovative software development and IT solutions.";

export const Route = createFileRoute("/demo/about")({
  head: () =>
    buildSeoMeta({
      path: "/demo/about",
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      ogImage: getPageOgImageUrl({
        title: "About Us",
        description: PAGE_DESCRIPTION,
        category: "Company",
      }),
    }),
});
