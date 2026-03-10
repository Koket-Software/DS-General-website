import { createFileRoute } from "@tanstack/react-router";

import { LandingLayout } from "@/features/landing/layout/LandingLayout";
import { publicBusinessSectorsQueryOptions } from "@/lib/business-sectors/business-sectors-query";
import { queryClient } from "@/main";

export const Route = createFileRoute("/_landing")({
  loader: async () => {
    await queryClient.ensureQueryData(
      publicBusinessSectorsQueryOptions({
        page: 1,
        limit: 50,
        sortBy: "publishDate",
        sortOrder: "desc",
      }),
    );

    return null;
  },
  component: LandingLayout,
});
