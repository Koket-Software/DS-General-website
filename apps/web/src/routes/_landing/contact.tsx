import { createFileRoute } from "@tanstack/react-router";

import { ContactPage } from "@/features/landing/pages/ContactPage";
import { publicSocialsQueryOptions } from "@/lib/socials/socials-query";
import { queryClient } from "@/main";

export const Route = createFileRoute("/_landing/contact")({
  loader: async () => {
    await queryClient.ensureQueryData(
      publicSocialsQueryOptions({ page: 1, limit: 20 }),
    );

    return null;
  },
  component: ContactPage,
});
