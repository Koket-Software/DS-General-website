import { createFileRoute } from "@tanstack/react-router";

import { TermsOfServicePage } from "@/features/landing/legal/terms-of-service-page";
import { buildStaticPageHead } from "@/lib/seo";

export const Route = createFileRoute("/_landing/terms-of-service")({
  head: () => buildStaticPageHead("/terms-of-service"),
  component: TermsOfServicePage,
});
