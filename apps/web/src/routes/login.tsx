import { createFileRoute } from "@tanstack/react-router";

import { buildNoIndexHead } from "@/lib/seo";

export const Route = createFileRoute("/login")({
  head: () =>
    buildNoIndexHead({
      path: "/login",
      title: "Admin Sign In | DS General PLC",
      description: "Protected sign-in page for the DS General PLC dashboard.",
    }),
});
