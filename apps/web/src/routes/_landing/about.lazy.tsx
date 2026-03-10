import { createLazyFileRoute } from "@tanstack/react-router";

import { AboutPage } from "@/features/landing/pages/AboutPage";

export const Route = createLazyFileRoute("/_landing/about")({
  component: AboutPage,
});
