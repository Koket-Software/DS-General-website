import { createLazyFileRoute } from "@tanstack/react-router";

import Tags from "@/features/dashboard/tags";
import { fetchTags } from "@/features/dashboard/tags/lib/tags-api";
import { tagKeys } from "@/features/dashboard/tags/lib/tags-query";
import {
  normalizeTagListParams,
  tagListParamsSchema,
  type TagListParams,
} from "@/features/dashboard/tags/lib/tags-schema";
import { prefetchResource } from "@/lib/prefetch";

export const Route = createLazyFileRoute("/dashboard/tags/")({
  validateSearch: (search: Record<string, unknown>) =>
    tagListParamsSchema.partial().parse({
      page: search.page ? Number(search.page) : undefined,
      limit: search.limit ? Number(search.limit) : undefined,
      search: typeof search.search === "string" ? search.search : undefined,
    }),
  loader: async ({ context, search }) => {
    const params = normalizeTagListParams(
      (search as Partial<TagListParams>) ?? {},
    );
    await prefetchResource(context.queryClient, tagKeys.list(params), () =>
      fetchTags(params),
    );
    return null;
  },
  component: Tags,
});
