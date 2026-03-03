import { createLazyFileRoute, getRouteApi } from "@tanstack/react-router";

import { CareerDetailPage } from "@/features/careers";

const routeApi = getRouteApi("/_site/careers/$slug");

export const Route = createLazyFileRoute("/_site/careers/$slug")({
  component: CareerDetailRoute,
});

function CareerDetailRoute() {
  const { vacancy } = routeApi.useLoaderData();
  return <CareerDetailPage vacancy={vacancy} />;
}
