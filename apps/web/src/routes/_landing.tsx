import { createFileRoute } from "@tanstack/react-router";

import { LandingLayout } from "@/features/landing/layout/LandingLayout";
import { publicBusinessSectorsQueryOptions } from "@/lib/business-sectors/business-sectors-query";

export const Route = createFileRoute("/_landing")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
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
