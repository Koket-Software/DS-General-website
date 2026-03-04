import { createFileRoute } from "@tanstack/react-router";

import { PrivacyPolicyPage } from "@/features/landing/legal/privacy-policy-page";

export const Route = createFileRoute("/_landing/privacy-policy")({
  component: PrivacyPolicyPage,
});
