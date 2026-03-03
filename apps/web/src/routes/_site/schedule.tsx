import { createFileRoute } from "@tanstack/react-router";

import { getPageOgImageUrl, SITE_METADATA } from "@/lib/og-utils";

const PAGE_TITLE = `Schedule a Meeting | ${SITE_METADATA.siteName}`;
const PAGE_DESCRIPTION =
  "Book a consultation with DS General PLC to discuss your service needs and project requirements.";

export const Route = createFileRoute("/_site/schedule")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESCRIPTION },
      // Open Graph
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESCRIPTION },
      {
        property: "og:image",
        content: getPageOgImageUrl({
          title: "Schedule a Meeting",
          description: PAGE_DESCRIPTION,
          category: "Booking",
        }),
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_METADATA.siteName },
      { property: "og:url", content: `${SITE_METADATA.siteUrl}/schedule` },
      // Twitter Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: PAGE_TITLE },
      { name: "twitter:description", content: PAGE_DESCRIPTION },
    ],
  }),
});
