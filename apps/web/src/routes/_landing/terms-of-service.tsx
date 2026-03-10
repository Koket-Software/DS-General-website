import { createFileRoute } from "@tanstack/react-router";

import { buildStaticPageHead } from "@/lib/seo";

export const Route = createFileRoute("/_landing/terms-of-service")({
  head: () => buildStaticPageHead("/terms-of-service"),
});
