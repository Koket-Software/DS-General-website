import { createLazyFileRoute, getRouteApi } from "@tanstack/react-router";

import {
  CaseStudyDetailPage,
  ProductDetailPage,
} from "@/features/work-samples";

const routeApi = getRouteApi("/_site/projects/$slug");

export const Route = createLazyFileRoute("/_site/projects/$slug")({
  component: ProjectDetailRoute,
});

function ProjectDetailRoute() {
  const loaderData = routeApi.useLoaderData();

  if (loaderData.type === "caseStudy") {
    return <CaseStudyDetailPage caseStudy={loaderData.data} />;
  }

  return <ProductDetailPage product={loaderData.data} />;
}
