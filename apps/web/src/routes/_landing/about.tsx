import { createFileRoute } from "@tanstack/react-router";

import { AboutPage } from "@/features/landing/pages/AboutPage";
import { publicCaseStudiesQueryOptions } from "@/lib/case-study/case-study-query";
import { publicOrgQueryOptions } from "@/lib/org/org-query";
import { clientPartnersQueryOptions } from "@/lib/partners/partners-query";
import { publicServicesQueryOptions } from "@/lib/services/services-query";
import { queryClient } from "@/main";

export const Route = createFileRoute("/_landing/about")({
  loader: async () => {
    await Promise.all([
      queryClient.ensureQueryData(clientPartnersQueryOptions()),
      queryClient.ensureQueryData(
        publicServicesQueryOptions({
          page: 1,
          limit: 6,
          sortBy: "createdAt",
          sortOrder: "desc",
        }),
      ),
      queryClient.ensureQueryData(
        publicCaseStudiesQueryOptions({ page: 1, limit: 6 }),
      ),
      queryClient.ensureQueryData(
        publicOrgQueryOptions({
          page: 1,
          limit: 100,
          sortBy: "lastName",
          sortOrder: "asc",
        }),
      ),
    ]);

    return null;
  },
  component: AboutPage,
});
