import { createFileRoute } from "@tanstack/react-router";

import { fetchPublicCaseStudyBySlug } from "@/lib/case-study/case-study-api";
import {
  buildSeoMeta,
  getDefaultOgImageUrl,
  getProjectOgImageUrl,
  SITE_METADATA,
} from "@/lib/og-utils";
import { fetchPublicProductBySlug } from "@/lib/products/products-api";

export const Route = createFileRoute("/_site/projects/$slug")({
  loader: async ({ params }: { params: Record<string, string> }) => {
    const [caseStudyResult, productResult] = await Promise.allSettled([
      fetchPublicCaseStudyBySlug(params.slug),
      fetchPublicProductBySlug(params.slug),
    ]);

    if (caseStudyResult.status === "fulfilled" && caseStudyResult.value.data) {
      return { type: "caseStudy" as const, data: caseStudyResult.value.data };
    }

    if (productResult.status === "fulfilled" && productResult.value.data) {
      return { type: "product" as const, data: productResult.value.data };
    }

    throw new Error("Project not found");
  },
  head: ({ loaderData, params }) => {
    const project = loaderData?.data;
    const title = project?.title
      ? `${project.title} | Projects | ${SITE_METADATA.siteName}`
      : `Projects | ${SITE_METADATA.siteName}`;
    // Use excerpt if available (case studies), fallback to description (products) or default
    const getDescription = (): string => {
      if (project && "excerpt" in project && project.excerpt) {
        return project.excerpt;
      }
      if (project && "description" in project && project.description) {
        return project.description;
      }
      return SITE_METADATA.defaultDescription;
    };
    const description = getDescription();
    const ogImage = params.slug
      ? getProjectOgImageUrl(params.slug)
      : getDefaultOgImageUrl();

    return buildSeoMeta({
      path: params.slug ? `/demo/projects/${params.slug}` : "/demo/projects",
      title,
      description,
      ogImage,
      type: "website",
    });
  },
});
