import { createFileRoute } from "@tanstack/react-router";

import { SourcingLogisticsPage } from "@/features/landing/pages/SourcingLogisticsPage";
import { publicBusinessSectorDetailQueryOptions } from "@/lib/business-sectors/business-sectors-query";
import { queryClient } from "@/main";

export const Route = createFileRoute("/_landing/sectors/sourcing-logistics")({
  loader: async () => {
    await queryClient.ensureQueryData(
      publicBusinessSectorDetailQueryOptions("sourcing-logistics"),
    );

    return null;
  },
  component: SourcingLogisticsPage,
});
