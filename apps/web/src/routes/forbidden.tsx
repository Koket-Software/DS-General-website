import { createFileRoute } from "@tanstack/react-router";

import { buildNoIndexHead } from "@/lib/seo";

export const Route = createFileRoute("/forbidden")({
  head: () =>
    buildNoIndexHead({
      path: "/forbidden",
      title: "Forbidden | DS General PLC",
      description: "Protected dashboard access restriction page.",
    }),
});
