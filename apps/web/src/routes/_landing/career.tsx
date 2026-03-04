import { createFileRoute } from "@tanstack/react-router";

import { CareerPage } from "@/features/landing/pages/CareerPage";

export const Route = createFileRoute("/_landing/career")({
  component: CareerPage,
});
