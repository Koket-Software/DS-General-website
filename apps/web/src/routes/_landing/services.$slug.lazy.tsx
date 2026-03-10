import { createLazyFileRoute } from "@tanstack/react-router";

import { ServiceDetailPage } from "@/features/landing/pages/ServiceDetailPage";

export const Route = createLazyFileRoute("/_landing/services/$slug")({
  component: ServiceDetailRoutePage,
});

function ServiceDetailRoutePage() {
  const { slug } = Route.useParams();
  return <ServiceDetailPage slug={slug} />;
}
