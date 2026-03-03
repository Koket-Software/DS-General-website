import { createFileRoute } from "@tanstack/react-router";

import {
  publicBusinessSectorDetailQueryOptions,
  publicBusinessSectorsQueryOptions,
} from "@/lib/business-sectors";
import { buildSeoMeta, getPageOgImageUrl, SITE_METADATA } from "@/lib/og-utils";
import { queryClient } from "@/main";

export const Route = createFileRoute("/demo/sectors/$slug")({
  loader: async ({ params }: { params: Record<string, string> }) => {
    const [sector] = await Promise.all([
      queryClient.ensureQueryData(
        publicBusinessSectorDetailQueryOptions(params.slug),
      ),
      queryClient.ensureQueryData(
        publicBusinessSectorsQueryOptions({
          limit: 50,
          sortBy: "title",
          sortOrder: "asc",
        }),
      ),
    ]);

    return { sector: sector?.data };
  },
  head: ({ loaderData, params }) => {
    const sector = loaderData?.sector;
    const title = sector?.title
      ? `${sector.title} | Business Sectors | ${SITE_METADATA.siteName}`
      : `Business Sectors | ${SITE_METADATA.siteName}`;
    const description = sector?.excerpt || SITE_METADATA.defaultDescription;

    const ogImage = getPageOgImageUrl({
      title: sector?.title ?? "Business Sectors",
      description,
      category: "Business Sectors",
      image: sector?.featuredImageUrl ?? undefined,
    });

    return buildSeoMeta({
      path: params.slug ? `/demo/sectors/${params.slug}` : "/demo/sectors",
      title,
      description,
      ogImage,
      type: "website",
    });
  },
});
