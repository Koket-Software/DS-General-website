import { createFileRoute } from "@tanstack/react-router";

import { SourcingLogisticsPage } from "@/features/landing/pages/SourcingLogisticsPage";

export const Route = createFileRoute("/_landing/sectors/sourcing-logistics")({
  component: SourcingLogisticsPage,
});
