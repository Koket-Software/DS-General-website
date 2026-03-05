import { createFileRoute } from "@tanstack/react-router";

import { GalleryPage } from "@/features/landing/pages/GalleryPage";
import {
  publicGalleryCategoriesQueryOptions,
  publicGalleryQueryOptions,
} from "@/lib/gallery/gallery-query";
import {
  normalizePublicGalleryCategoryParams,
  normalizePublicGalleryParams,
  publicGalleryParamsSchema,
} from "@/lib/gallery/gallery-schema";
import { queryClient } from "@/main";

const toFiniteNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const Route = createFileRoute("/_landing/gallery")({
  validateSearch: (search: Record<string, unknown>) =>
    publicGalleryParamsSchema.partial().parse({
      page: toFiniteNumber(search.page),
      limit: toFiniteNumber(search.limit),
      search: typeof search.search === "string" ? search.search : undefined,
      sortBy: typeof search.sortBy === "string" ? search.sortBy : undefined,
      sortOrder:
        search.sortOrder === "asc" || search.sortOrder === "desc"
          ? search.sortOrder
          : undefined,
      categorySlug:
        typeof search.categorySlug === "string"
          ? search.categorySlug
          : undefined,
    }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const itemParams = normalizePublicGalleryParams(deps);
    const categoryParams = normalizePublicGalleryCategoryParams({
      page: 1,
      limit: 100,
      sortBy: "name",
      sortOrder: "asc",
    });

    await Promise.all([
      queryClient.ensureQueryData(publicGalleryQueryOptions(itemParams)),
      queryClient.ensureQueryData(
        publicGalleryCategoriesQueryOptions(categoryParams),
      ),
    ]);

    return null;
  },
  component: GalleryPage,
});
