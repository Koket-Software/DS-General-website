import { createFileRoute } from "@tanstack/react-router";

import { buildSeoMeta, getPageOgImageUrl, SITE_METADATA } from "@/lib/og-utils";

const PAGE_TITLE = `Schedule a Meeting | ${SITE_METADATA.siteName}`;
const PAGE_DESCRIPTION =
  "Book a consultation with DS General PLC to discuss your service needs and project requirements.";

export const Route = createFileRoute("/_site/schedule")({
  head: () =>
    buildSeoMeta({
      path: "/demo/schedule",
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      ogImage: getPageOgImageUrl({
        title: "Schedule a Meeting",
        description: PAGE_DESCRIPTION,
        category: "Booking",
      }),
    }),
});
