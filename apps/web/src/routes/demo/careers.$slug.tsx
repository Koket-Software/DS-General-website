import { createFileRoute } from "@tanstack/react-router";

import { fetchPublicVacancyBySlug } from "@/features/careers/lib/careers-api";
import {
  buildSeoMeta,
  getCareerOgImageUrl,
  getDefaultOgImageUrl,
  SITE_METADATA,
} from "@/lib/og-utils";

export const Route = createFileRoute("/demo/careers/$slug")({
  loader: async ({ params }: { params: Record<string, string> }) => {
    const data = await fetchPublicVacancyBySlug(params.slug);
    return { vacancy: data.data };
  },
  head: ({ loaderData, params }) => {
    const vacancy = loaderData?.vacancy;
    const title = vacancy?.title
      ? `${vacancy.title} | Careers | ${SITE_METADATA.siteName}`
      : `Careers | ${SITE_METADATA.siteName}`;
    const description = vacancy?.excerpt || SITE_METADATA.defaultDescription;
    const ogImage = params.slug
      ? getCareerOgImageUrl(params.slug)
      : getDefaultOgImageUrl();

    return buildSeoMeta({
      path: params.slug ? `/demo/careers/${params.slug}` : "/demo/careers",
      title,
      description,
      ogImage,
      type: "website",
    });
  },
});
