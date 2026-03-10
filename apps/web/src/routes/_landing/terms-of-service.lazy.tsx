import { createLazyFileRoute } from "@tanstack/react-router";

import { TermsOfServicePage } from "@/features/landing/legal/terms-of-service-page";

export const Route = createLazyFileRoute("/_landing/terms-of-service")({
  component: TermsOfServicePage,
});
