import { createFileRoute } from "@tanstack/react-router";

import { buildStaticPageHead } from "@/lib/seo";

export const Route = createFileRoute("/_landing/privacy-policy")({
  head: () => buildStaticPageHead("/privacy-policy"),
});
