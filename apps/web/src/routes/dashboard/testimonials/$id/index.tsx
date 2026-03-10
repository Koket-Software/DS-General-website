import { createFileRoute } from "@tanstack/react-router";

import { fetchTestimonialById } from "@/features/dashboard/testimonials/lib/testimonials-api";
import { testimonialKeys } from "@/features/dashboard/testimonials/lib/testimonials-query";
import type { AppRouterContext } from "@/lib/app-router";
import { prefetchResource } from "@/lib/prefetch";

export const Route = createFileRoute("/dashboard/testimonials/$id/")({
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
        "Missing testimonial id. Please navigate from the testimonials list.",
      );
    }

    await prefetchResource(
      context.queryClient,
      testimonialKeys.detail(id),
      () => fetchTestimonialById(id),
    );

    return { id };
  },
});
