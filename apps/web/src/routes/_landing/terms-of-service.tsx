import { createFileRoute } from "@tanstack/react-router";

import { TermsOfServicePage } from "@/features/landing/legal/terms-of-service-page";

export const Route = createFileRoute("/_landing/terms-of-service")({
  component: TermsOfServicePage,
});
