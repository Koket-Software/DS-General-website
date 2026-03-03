import { createFileRoute } from "@tanstack/react-router";

import { publicBusinessSectorsQueryOptions } from "@/lib/business-sectors";
import { buildSeoMeta, getPageOgImageUrl, SITE_METADATA } from "@/lib/og-utils";
import { queryClient } from "@/main";

const PAGE_TITLE = `Business Sectors | ${SITE_METADATA.siteName}`;
const PAGE_DESCRIPTION =
  "See the industries and business domains where we deliver digital outcomes.";

export const Route = createFileRoute("/_site/sectors/")({
  loader: async () => {
    await queryClient.ensureQueryData(
      publicBusinessSectorsQueryOptions({
        limit: 50,
        sortBy: "title",
        sortOrder: "asc",
      }),
    );

    return null;
  },
  head: () =>
    buildSeoMeta({
      path: "/demo/sectors",
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      ogImage: getPageOgImageUrl({
        title: "Business Sectors",
        description: PAGE_DESCRIPTION,
        category: "Industries",
      }),
    }),
});
