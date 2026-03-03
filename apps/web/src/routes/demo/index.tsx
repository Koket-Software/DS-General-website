import { createFileRoute } from "@tanstack/react-router";

import { publicCaseStudiesQueryOptions } from "@/lib/case-study/case-study-query";
import { faqListQueryOptions } from "@/lib/faq/faq-query";
import {
  buildSeoMeta,
  getDefaultOgImageUrl,
  SITE_METADATA,
} from "@/lib/og-utils";
import { clientPartnersQueryOptions } from "@/lib/partners";
import { testimonialListQueryOptions } from "@/lib/testimonial/testimonial-query";
import { queryClient } from "@/main";

export const Route = createFileRoute("/demo/")({
  loader: async () => {
    // Prefetch data for the home page
    await Promise.all([
      queryClient.ensureQueryData(clientPartnersQueryOptions()),
      queryClient.ensureQueryData(testimonialListQueryOptions({ limit: 5 })),
      queryClient.ensureQueryData(faqListQueryOptions({ limit: 10 })),
      queryClient.ensureQueryData(publicCaseStudiesQueryOptions({ limit: 6 })),
    ]);
  },
  head: () =>
    buildSeoMeta({
      path: "/demo",
      title: SITE_METADATA.defaultTitle,
      description: SITE_METADATA.defaultDescription,
      ogImage: getDefaultOgImageUrl(),
    }),
});
