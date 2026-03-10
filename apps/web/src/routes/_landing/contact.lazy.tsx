import { createLazyFileRoute } from "@tanstack/react-router";

import { ContactPage } from "@/features/landing/pages/ContactPage";

export const Route = createLazyFileRoute("/_landing/contact")({
  component: ContactPage,
});
