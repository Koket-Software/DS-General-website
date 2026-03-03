import { createFileRoute } from "@tanstack/react-router";

import { buildSeoMeta, getPageOgImageUrl, SITE_METADATA } from "@/lib/og-utils";

const PAGE_TITLE = `Projects | ${SITE_METADATA.siteName}`;
const PAGE_DESCRIPTION =
  "Browse selected case studies and product builds delivered across sectors.";

export const Route = createFileRoute("/demo/projects/")({
  head: () =>
    buildSeoMeta({
      path: "/demo/projects",
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      ogImage: getPageOgImageUrl({
        title: "Projects",
        description: PAGE_DESCRIPTION,
        category: "Case Studies",
      }),
    }),
});
