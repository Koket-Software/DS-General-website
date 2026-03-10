import { createFileRoute } from "@tanstack/react-router";

import { ContactPage } from "@/features/landing/pages/ContactPage";
import { buildStaticPageHead } from "@/lib/seo";
import { publicServicesQueryOptions } from "@/lib/services/services-query";
import { publicSocialsQueryOptions } from "@/lib/socials/socials-query";

export const Route = createFileRoute("/_landing/contact")({
  head: () => buildStaticPageHead("/contact"),
  loader: async ({ context }) => {
    return Promise.all([
      context.queryClient.ensureQueryData(
        publicSocialsQueryOptions({ page: 1, limit: 20 }),
      ),
      context.queryClient.ensureQueryData(
        publicServicesQueryOptions({
          page: 1,
          limit: 50,
          sortBy: "createdAt",
          sortOrder: "desc",
        }),
      ),
    ]);
  },
  component: ContactPage,
});
