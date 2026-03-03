import { createFileRoute } from "@tanstack/react-router";

import { buildSeoMeta, getPageOgImageUrl, SITE_METADATA } from "@/lib/og-utils";
import { publicServicesQueryOptions } from "@/lib/services/services-query";
import { publicTagsQueryOptions } from "@/lib/tags/tags-query";
import { queryClient } from "@/main";

const PAGE_TITLE = `Services | ${SITE_METADATA.siteName}`;
const PAGE_DESCRIPTION =
  "Discover the services we offer across product engineering, design, and delivery.";

export const Route = createFileRoute("/demo/services/")({
  loader: async () => {
    await Promise.all([
      queryClient.ensureQueryData(publicTagsQueryOptions({ limit: 50 })),
      queryClient.ensureQueryData(publicServicesQueryOptions({ limit: 50 })),
    ]);

    return null;
  },
  head: () =>
    buildSeoMeta({
      path: "/demo/services",
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      ogImage: getPageOgImageUrl({
        title: "Services",
        description: PAGE_DESCRIPTION,
        category: "Capabilities",
      }),
    }),
});
