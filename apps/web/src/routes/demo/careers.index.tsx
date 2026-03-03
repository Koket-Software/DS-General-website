import { createFileRoute } from "@tanstack/react-router";

import { buildSeoMeta, getPageOgImageUrl, SITE_METADATA } from "@/lib/og-utils";

const PAGE_TITLE = `Careers | ${SITE_METADATA.siteName}`;
const PAGE_DESCRIPTION =
  "Explore open roles and join our team building meaningful digital products.";

export const Route = createFileRoute("/demo/careers/")({
  head: () =>
    buildSeoMeta({
      path: "/demo/careers",
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      ogImage: getPageOgImageUrl({
        title: "Careers",
        description: PAGE_DESCRIPTION,
        category: "Hiring",
      }),
    }),
});
