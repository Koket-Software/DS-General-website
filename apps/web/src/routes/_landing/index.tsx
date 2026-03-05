import { createFileRoute } from "@tanstack/react-router";

import { HomePage } from "@/features/landing/pages/HomePage";
import { publicBlogsQueryOptions } from "@/lib/blogs/blogs-query";
import { publicCaseStudiesQueryOptions } from "@/lib/case-study/case-study-query";
import { faqListQueryOptions } from "@/lib/faq/faq-query";
import { publicServicesQueryOptions } from "@/lib/services/services-query";
import { testimonialListQueryOptions } from "@/lib/testimonial/testimonial-query";
import { queryClient } from "@/main";

export const Route = createFileRoute("/_landing/")({
  loader: async () => {
    await Promise.all([
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
        testimonialListQueryOptions({ page: 1, limit: 8 }),
      ),
      queryClient.ensureQueryData(faqListQueryOptions({ page: 1, limit: 8 })),
      queryClient.ensureQueryData(
        publicBlogsQueryOptions({
          page: 1,
          limit: 3,
          sortBy: "publishDate",
          sortOrder: "desc",
        }),
      ),
    ]);

    return null;
  },
  component: HomePage,
});
