import { createLazyFileRoute } from "@tanstack/react-router";

import OrganizationalStructure from "@/features/dashboard/organizational-structure";
import { fetchOrgMembers } from "@/features/dashboard/organizational-structure/lib/org-api";
import { orgMemberKeys } from "@/features/dashboard/organizational-structure/lib/org-query";
import {
  normalizeOrgMembersListParams,
  orgMembersListParamsSchema,
} from "@/features/dashboard/organizational-structure/lib/org-schema";
import { prefetchResource } from "@/lib/prefetch";

export const Route = createLazyFileRoute(
  "/dashboard/organizational-structure/",
)({
  validateSearch: (search: Record<string, unknown>) =>
    orgMembersListParamsSchema.partial().parse({
      page: search.page ? Number(search.page) : undefined,
      limit: search.limit ? Number(search.limit) : undefined,
      search: typeof search.search === "string" ? search.search : undefined,
      sortBy: typeof search.sortBy === "string" ? search.sortBy : undefined,
      sortOrder:
        search.sortOrder === "asc" || search.sortOrder === "desc"
          ? search.sortOrder
          : undefined,
    }),
  loader: async ({ context, search }) => {
    const params = normalizeOrgMembersListParams(search);
    await prefetchResource(
      context.queryClient,
      orgMemberKeys.list(params),
      () => fetchOrgMembers(params),
    );
    return null;
  },
  component: OrganizationalStructure,
});
