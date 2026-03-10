import { createLazyFileRoute } from "@tanstack/react-router";

import { HomePage } from "@/features/landing/pages/HomePage";

export const Route = createLazyFileRoute("/_landing/")({
  component: HomePage,
});
