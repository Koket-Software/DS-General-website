import { createFileRoute } from "@tanstack/react-router";

import { CareerDetailPage } from "@/features/landing/pages/CareerDetailPage";

export const Route = createFileRoute("/_landing/career/$id")({
  component: CareerRoutePage,
});

function CareerRoutePage() {
  const { id } = Route.useParams();
  return <CareerDetailPage id={id} />;
}
