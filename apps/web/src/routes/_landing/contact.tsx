import { createFileRoute } from "@tanstack/react-router";

import { ContactPage } from "@/features/landing/pages/ContactPage";
import { publicServicesQueryOptions } from "@/lib/services/services-query";
import { publicSocialsQueryOptions } from "@/lib/socials/socials-query";
import { queryClient } from "@/main";

export const Route = createFileRoute("/_landing/contact")({
  loader: async () => {
    await Promise.all([
      queryClient.ensureQueryData(
        publicSocialsQueryOptions({ page: 1, limit: 20 }),
      ),
      queryClient.ensureQueryData(
        publicServicesQueryOptions({
          page: 1,
          limit: 50,
          sortBy: "createdAt",
          sortOrder: "desc",
        }),
      ),
    ]);

    return null;
  },
  component: ContactPage,
});
