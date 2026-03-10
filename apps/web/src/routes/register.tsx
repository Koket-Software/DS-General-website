import { createFileRoute } from "@tanstack/react-router";

import { buildNoIndexHead } from "@/lib/seo";

export const Route = createFileRoute("/register")({
  head: () =>
    buildNoIndexHead({
      path: "/register",
      title: "Admin Registration | DS General PLC",
      description:
        "Protected registration page for the DS General PLC dashboard.",
    }),
});
