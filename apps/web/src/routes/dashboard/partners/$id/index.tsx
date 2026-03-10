import { createFileRoute } from "@tanstack/react-router";

import { fetchPartnerById } from "@/features/dashboard/partners/lib/partners-api";
import { partnerKeys } from "@/features/dashboard/partners/lib/partners-query";
import type { AppRouterContext } from "@/lib/app-router";
import { prefetchResource } from "@/lib/prefetch";

export const Route = createFileRoute("/dashboard/partners/$id/")({
  loader: async ({
    context,
    params,
  }: {
    context: AppRouterContext;
    params: { id: string };
  }) => {
    const id = Number(params.id);

    if (!Number.isFinite(id) || id <= 0) {
      throw new Error(
        "Missing partner id. Please navigate from the partners list.",
      );
    }

    await prefetchResource(context.queryClient, partnerKeys.detail(id), () =>
      fetchPartnerById(id),
    );

    return { id };
  },
});
