import { createLazyFileRoute } from "@tanstack/react-router";

import { CareerDetailPage } from "@/features/landing/pages/CareerDetailPage";

export const Route = createLazyFileRoute("/_landing/career/$slug")({
  component: CareerRoutePage,
});

function CareerRoutePage() {
  const { slug } = Route.useParams();
  return <CareerDetailPage slug={slug} />;
}
