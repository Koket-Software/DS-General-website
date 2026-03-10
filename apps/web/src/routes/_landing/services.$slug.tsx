import { createFileRoute } from "@tanstack/react-router";

import { buildServiceDetailHead } from "@/lib/seo";
import type {
  PublicServiceDetailResponse,
  PublicServicesListResponse,
} from "@/lib/services/services-api";
import {
  publicServiceBySlugQueryOptions,
  publicServicesQueryOptions,
} from "@/lib/services/services-query";

interface ServiceRouteLoaderData {
  service: PublicServiceDetailResponse;
  relatedServices: PublicServicesListResponse;
}

export const Route = createFileRoute("/_landing/services/$slug")({
  head: ({ loaderData, params }) => {
    const service = (loaderData as ServiceRouteLoaderData | undefined)?.service
      ?.data;
    const firstImage = service?.images?.[0]?.imageUrl;

    if (!service) {
      return buildServiceDetailHead({
        slug: params.slug,
        title: params.slug,
      });
    }

    return buildServiceDetailHead({
      slug: params.slug,
      title: service.title,
      excerpt: service.excerpt,
      featuredImageUrl: firstImage,
    });
  },
  loader: async ({ context, params }) => {
    const { slug } = params;

    const [service, relatedServices] = await Promise.all([
      context.queryClient.ensureQueryData(
        publicServiceBySlugQueryOptions(slug),
      ),
      context.queryClient.ensureQueryData(
        publicServicesQueryOptions({
          page: 1,
          limit: 8,
          sortBy: "createdAt",
          sortOrder: "desc",
        }),
      ),
    ]);

    return { service, relatedServices } satisfies ServiceRouteLoaderData;
  },
});
