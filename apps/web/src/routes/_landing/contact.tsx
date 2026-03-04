import { createFileRoute } from "@tanstack/react-router";

import { ContactPage } from "@/features/landing/pages/ContactPage";

export const Route = createFileRoute("/_landing/contact")({
  component: ContactPage,
});
