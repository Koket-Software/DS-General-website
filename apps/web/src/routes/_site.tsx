import { createFileRoute } from "@tanstack/react-router";

import { LandingGateway } from "@/features/App";

export const Route = createFileRoute("/_site")({
  component: LandingGateway,
});
