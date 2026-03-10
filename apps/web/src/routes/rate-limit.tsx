import { createFileRoute } from "@tanstack/react-router";

import { buildNoIndexHead } from "@/lib/seo";

export const Route = createFileRoute("/rate-limit")({
  head: () =>
    buildNoIndexHead({
      path: "/rate-limit",
      title: "Rate Limit | DS General PLC",
      description: "Protected operational error page for rate limit events.",
    }),
});
