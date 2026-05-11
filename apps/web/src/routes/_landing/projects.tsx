import { createFileRoute } from "@tanstack/react-router";

import { publicCaseStudiesQueryOptions } from "@/lib/case-study/case-study-query";
import { buildLeafStaticPageHead } from "@/lib/seo";

export const Route = createFileRoute("/_landing/projects")({
  head: ({ match, matches }) =>
    buildLeafStaticPageHead("/projects", { match, matches }),
  loader: async ({ context }) => {
    return context.queryClient.ensureQueryData(
      publicCaseStudiesQueryOptions({ page: 1, limit: 12 }),
    );
  },
});
