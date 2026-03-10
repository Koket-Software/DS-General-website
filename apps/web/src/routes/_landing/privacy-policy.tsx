import { createFileRoute } from "@tanstack/react-router";

import { PrivacyPolicyPage } from "@/features/landing/legal/privacy-policy-page";
import { buildStaticPageHead } from "@/lib/seo";

export const Route = createFileRoute("/_landing/privacy-policy")({
  head: () => buildStaticPageHead("/privacy-policy"),
  component: PrivacyPolicyPage,
});
