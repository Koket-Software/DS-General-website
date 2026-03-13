import { createFileRoute } from "@tanstack/react-router";

import type {
  PublicCaseStudyDetailResponse,
  PublicCaseStudiesListResponse,
} from "@/lib/case-study/case-study-api";
import {
  publicCaseStudiesQueryOptions,
  publicCaseStudyDetailQueryOptions,
} from "@/lib/case-study/case-study-query";
import { buildProjectDetailHead } from "@/lib/seo";

interface ProjectRouteLoaderData {
  project: PublicCaseStudyDetailResponse;
  otherProjects: PublicCaseStudiesListResponse;
}

export const Route = createFileRoute("/_landing/projects/$slug")({
  head: ({ loaderData, params }) => {
    const project = (loaderData as ProjectRouteLoaderData | undefined)?.project
      ?.data;
    const firstImage = project?.images?.[0]?.imageUrl;

    if (!project) {
      return buildProjectDetailHead({
        slug: params.slug,
        title: params.slug,
      });
    }

    return buildProjectDetailHead({
      slug: params.slug,
      title: project.title,
      excerpt: project.excerpt,
      featuredImageUrl: firstImage,
    });
  },
  loader: async ({ context, params }) => {
    const { slug } = params;

    const [project, otherProjects] = await Promise.all([
      context.queryClient.ensureQueryData(
        publicCaseStudyDetailQueryOptions(slug),
      ),
      context.queryClient.ensureQueryData(
        publicCaseStudiesQueryOptions({ page: 1, limit: 8 }),
      ),
    ]);

    return { project, otherProjects } satisfies ProjectRouteLoaderData;
  },
});
