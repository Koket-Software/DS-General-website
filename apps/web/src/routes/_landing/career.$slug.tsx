import { createFileRoute } from "@tanstack/react-router";

import { CareerDetailPage } from "@/features/landing/pages/CareerDetailPage";
import { publicVacancyBySlugQueryOptions } from "@/lib/vacancies/vacancies-query";
import { queryClient } from "@/main";

export const Route = createFileRoute("/_landing/career/$slug")({
  loader: async ({ params }) => {
    const { slug } = params;

    await queryClient.ensureQueryData(publicVacancyBySlugQueryOptions(slug));

    return null;
  },
  component: CareerRoutePage,
});

function CareerRoutePage() {
  const { slug } = Route.useParams();
  return <CareerDetailPage slug={slug} />;
}
