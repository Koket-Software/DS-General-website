import { createFileRoute } from "@tanstack/react-router";

import { AboutPage } from "@/features/landing/pages/AboutPage";

export const Route = createFileRoute("/_landing/about")({
  component: AboutPage,
});
