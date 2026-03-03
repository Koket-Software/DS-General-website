import { createFileRoute } from "@tanstack/react-router";

import { buildSeoMeta, getPageOgImageUrl, SITE_METADATA } from "@/lib/og-utils";

const PAGE_TITLE = `Contact Us | ${SITE_METADATA.siteName}`;
const PAGE_DESCRIPTION =
  "Get in touch with us. We'd love to hear about your project and discuss how we can help bring your ideas to life.";

export const Route = createFileRoute("/demo/contact")({
  head: () =>
    buildSeoMeta({
      path: "/demo/contact",
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      ogImage: getPageOgImageUrl({
        title: "Contact Us",
        description: PAGE_DESCRIPTION,
        category: "Contact",
      }),
    }),
});
