import { createFileRoute } from "@tanstack/react-router";

import { publicAchievementsQueryOptions } from "@/lib/achievements";
import { publicBlogsQueryOptions } from "@/lib/blogs/blogs-query";
import { publicCaseStudiesQueryOptions } from "@/lib/case-study/case-study-query";
import { faqListQueryOptions } from "@/lib/faq/faq-query";
import { buildStaticPageHead } from "@/lib/seo";
import { publicServicesQueryOptions } from "@/lib/services/services-query";
import { testimonialListQueryOptions } from "@/lib/testimonial/testimonial-query";

export const Route = createFileRoute("/_landing/")({
  head: () => buildStaticPageHead("/"),
  loader: async ({ context }) => {
    return Promise.all([
      context.queryClient.ensureQueryData(
        publicAchievementsQueryOptions({ page: 1, limit: 6 }),
      ),
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
        testimonialListQueryOptions({ page: 1, limit: 8 }),
      ),
      context.queryClient.ensureQueryData(
        faqListQueryOptions({ page: 1, limit: 8 }),
      ),
      context.queryClient.ensureQueryData(
        publicBlogsQueryOptions({
          page: 1,
          limit: 3,
          sortBy: "publishDate",
          sortOrder: "desc",
        }),
      ),
    ]);
  },
});
