import { createFileRoute } from "@tanstack/react-router";

import { buildCareerDetailHead } from "@/lib/seo";
import type { PublicVacancyResponse } from "@/lib/vacancies/vacancies-api";
import { publicVacancyBySlugQueryOptions } from "@/lib/vacancies/vacancies-query";

export const Route = createFileRoute("/_landing/career/$slug")({
  head: ({ loaderData, params }) => {
    const vacancy = (loaderData as PublicVacancyResponse | undefined)?.data;

    if (!vacancy) {
      return buildCareerDetailHead({
        slug: params.slug,
        title: params.slug,
      });
    }

    return buildCareerDetailHead({
      slug: params.slug,
      title: vacancy.title,
      excerpt: vacancy.excerpt,
      featuredImageUrl: vacancy.featuredImageUrl,
      department: vacancy.department,
      location: vacancy.location,
      publishedAt: vacancy.publishedAt,
      employmentType: vacancy.employmentType,
    });
  },
  loader: async ({ context, params }) => {
    const { slug } = params;

    return context.queryClient.ensureQueryData(
      publicVacancyBySlugQueryOptions(slug),
    );
  },
});
