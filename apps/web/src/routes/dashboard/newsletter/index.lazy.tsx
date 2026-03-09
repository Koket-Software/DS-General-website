import { createLazyFileRoute } from "@tanstack/react-router";

import NewsletterIndex from "@/features/dashboard/newsletter";
import { fetchNewsletters } from "@/features/dashboard/newsletter/lib/newsletter-api";
import { newsletterKeys } from "@/features/dashboard/newsletter/lib/newsletter-query";
import {
  newsletterListParamsSchema,
  normalizeNewsletterListParams,
  type NewsletterListParams,
} from "@/features/dashboard/newsletter/lib/newsletter-schema";
import { prefetchResource } from "@/lib/prefetch";
import { queryClient } from "@/main";

export const Route = createLazyFileRoute("/dashboard/newsletter/")({
  validateSearch: (search: Record<string, unknown>) =>
    newsletterListParamsSchema.partial().parse({
      page: search.page ? Number(search.page) : undefined,
      limit: search.limit ? Number(search.limit) : undefined,
      search: typeof search.search === "string" ? search.search : undefined,
      isActive:
        typeof search.isActive === "boolean" ? search.isActive : undefined,
      sortBy: typeof search.sortBy === "string" ? search.sortBy : undefined,
      sortOrder:
        search.sortOrder === "asc" || search.sortOrder === "desc"
          ? search.sortOrder
          : undefined,
    }),
  loader: async ({ search }: { search: Record<string, unknown> }) => {
    const params = normalizeNewsletterListParams(
      (search as Partial<NewsletterListParams>) ?? {},
    );

    await prefetchResource(queryClient, newsletterKeys.list(params), () =>
      fetchNewsletters(params),
    );

    return null;
  },
  component: NewsletterIndex,
});
