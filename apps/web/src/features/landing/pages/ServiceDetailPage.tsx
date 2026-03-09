import { ServiceDetailSection } from "../components/service-detail-section";

interface ServiceDetailPageProps {
  slug: string;
}

export function ServiceDetailPage({ slug }: ServiceDetailPageProps) {
  return <ServiceDetailSection slug={slug} />;
}
