import { SourcingLogisticsSection } from "../components/sourcing-logistics-section";

interface BusinessSectorPageProps {
  slug: string;
}

export function BusinessSectorPage({ slug }: BusinessSectorPageProps) {
  return <SourcingLogisticsSection slug={slug} />;
}
