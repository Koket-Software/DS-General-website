import { createFileRoute } from "@tanstack/react-router";

import { AboutPage } from "@/features/landing/pages/AboutPage";
import { publicAchievementsQueryOptions } from "@/lib/achievements";
import { publicCaseStudiesQueryOptions } from "@/lib/case-study/case-study-query";
import { publicOrgQueryOptions } from "@/lib/org/org-query";
import { clientPartnersQueryOptions } from "@/lib/partners/partners-query";
import { buildStaticPageHead } from "@/lib/seo";
import { publicServicesQueryOptions } from "@/lib/services/services-query";

export const Route = createFileRoute("/_landing/about")({
  head: () => buildStaticPageHead("/about"),
  loader: async ({ context }) => {
    return Promise.all([
      context.queryClient.ensureQueryData(
        publicAchievementsQueryOptions({ page: 1, limit: 6 }),
      ),
      context.queryClient.ensureQueryData(clientPartnersQueryOptions()),
      context.queryClient.ensureQueryData(
        publicServicesQueryOptions({
          page: 1,
          limit: 6,
          sortBy: "createdAt",
          sortOrder: "desc",
        }),
      ),
      context.queryClient.ensureQueryData(
        publicCaseStudiesQueryOptions({ page: 1, limit: 6 }),
      ),
      context.queryClient.ensureQueryData(
        publicOrgQueryOptions({
          page: 1,
          limit: 100,
          sortBy: "lastName",
          sortOrder: "asc",
        }),
      ),
    ]);
  },
  component: AboutPage,
});
