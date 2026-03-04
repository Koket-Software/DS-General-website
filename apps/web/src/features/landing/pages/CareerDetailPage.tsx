import { CareerDetailSection } from "../components/career-detail-section";

interface CareerDetailPageProps {
  id: string;
}

export function CareerDetailPage({ id }: CareerDetailPageProps) {
  return <CareerDetailSection id={id} />;
}
