import { createLazyFileRoute } from "@tanstack/react-router";

import { PrivacyPolicyPage } from "@/features/landing/legal/privacy-policy-page";

export const Route = createLazyFileRoute("/_landing/privacy-policy")({
  component: PrivacyPolicyPage,
});
