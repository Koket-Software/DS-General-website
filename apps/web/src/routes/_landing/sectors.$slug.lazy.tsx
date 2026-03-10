import { createLazyFileRoute } from "@tanstack/react-router";

import { BusinessSectorPage } from "@/features/landing/pages/SourcingLogisticsPage";

export const Route = createLazyFileRoute("/_landing/sectors/$slug")({
  component: SectorRoutePage,
});

function SectorRoutePage() {
  const { slug } = Route.useParams();
  return <BusinessSectorPage slug={slug} />;
}
