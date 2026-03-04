import { createFileRoute } from "@tanstack/react-router";

import { HomePage } from "@/features/landing/pages/HomePage";

export const Route = createFileRoute("/_landing/")({
  component: HomePage,
});
