import { createFileRoute } from "@tanstack/react-router";

import { LandingLayout } from "@/features/landing/layout/LandingLayout";

export const Route = createFileRoute("/_landing")({
  component: LandingLayout,
});
