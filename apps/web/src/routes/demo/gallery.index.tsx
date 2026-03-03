import { createFileRoute } from "@tanstack/react-router";

import {
  publicGalleryCategoriesQueryOptions,
  publicGalleryQueryOptions,
} from "@/lib/gallery/gallery-query";
import { buildSeoMeta, getPageOgImageUrl, SITE_METADATA } from "@/lib/og-utils";
import { queryClient } from "@/main";

const PAGE_TITLE = `Gallery | ${SITE_METADATA.siteName}`;
const PAGE_DESCRIPTION =
  "A curated gallery of product visuals, team work, and delivery highlights.";

export const Route = createFileRoute("/demo/gallery/")({
  loader: async () => {
    await Promise.all([
      queryClient.ensureQueryData(
        publicGalleryCategoriesQueryOptions({
          limit: 100,
          sortBy: "name",
          sortOrder: "asc",
        }),
      ),
      queryClient.ensureQueryData(
        publicGalleryQueryOptions({
          limit: 100,
          sortBy: "occurredAt",
          sortOrder: "desc",
        }),
      ),
    ]);

    return null;
  },
  head: () =>
    buildSeoMeta({
      path: "/demo/gallery",
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      ogImage: getPageOgImageUrl({
        title: "Gallery",
        description: PAGE_DESCRIPTION,
        category: "Showcase",
      }),
    }),
});
