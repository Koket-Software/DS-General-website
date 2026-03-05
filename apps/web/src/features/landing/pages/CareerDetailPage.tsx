import { CareerDetailSection } from "../components/career-detail-section";

interface CareerDetailPageProps {
  slug: string;
}

export function CareerDetailPage({ slug }: CareerDetailPageProps) {
  return <CareerDetailSection slug={slug} />;
}
