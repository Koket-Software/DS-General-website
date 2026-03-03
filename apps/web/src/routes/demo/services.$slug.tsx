import { createFileRoute } from "@tanstack/react-router";

import {
  buildSeoMeta,
  getDefaultOgImageUrl,
  getServiceOgImageUrl,
  SITE_METADATA,
} from "@/lib/og-utils";
import { publicServiceBySlugQueryOptions } from "@/lib/services/services-query";
import { queryClient } from "@/main";

export const Route = createFileRoute("/demo/services/$slug")({
  loader: async ({ params }: { params: Record<string, string> }) => {
    // Prefetch service detail data
    const result = await queryClient.ensureQueryData(
      publicServiceBySlugQueryOptions(params.slug),
    );

    return { service: result?.data };
  },
  head: ({ loaderData, params }) => {
    const service = loaderData?.service;
    const title = service?.title
      ? `${service.title} | Services | ${SITE_METADATA.siteName}`
      : `Services | ${SITE_METADATA.siteName}`;
    // Use description since service doesn't have excerpt
    const description =
      service?.description || SITE_METADATA.defaultDescription;
    const ogImage = params.slug
      ? getServiceOgImageUrl(params.slug)
      : getDefaultOgImageUrl();

    return buildSeoMeta({
      path: params.slug ? `/demo/services/${params.slug}` : "/demo/services",
      title,
      description,
      ogImage,
      type: "website",
    });
  },
});
