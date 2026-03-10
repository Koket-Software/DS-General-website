import { createFileRoute } from "@tanstack/react-router";

import { BusinessSectorPage } from "@/features/landing/pages/SourcingLogisticsPage";
import {
  publicBusinessSectorDetailQueryOptions,
  publicBusinessSectorsQueryOptions,
} from "@/lib/business-sectors/business-sectors-query";
import { queryClient } from "@/main";

export const Route = createFileRoute("/_landing/sectors/$slug")({
  loader: async ({ params }) => {
    const { slug } = params;

    await Promise.all([
      queryClient.ensureQueryData(publicBusinessSectorDetailQueryOptions(slug)),
      queryClient.ensureQueryData(
        publicBusinessSectorsQueryOptions({
          page: 1,
          limit: 50,
          sortBy: "publishDate",
          sortOrder: "desc",
        }),
      ),
    ]);

    return null;
  },
  component: SectorRoutePage,
});

function SectorRoutePage() {
  const { slug } = Route.useParams();
  return <BusinessSectorPage slug={slug} />;
}
